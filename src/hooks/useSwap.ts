import { ethers, VoidSigner } from "ethers";
import { useChainId, useAccount } from "wagmi";
import { DEPRECATED_RPC_PROVIDERS } from "@/lib/providers";
import ERC20_abi from '@/utils/abis/ERC20_abi.json';
import { Token, V3_CORE_FACTORY_ADDRESSES } from "@uniswap/sdk-core";
import { Pool, computePoolAddress, Route as V3Route, POOL_INIT_CODE_HASH } from '@uniswap/v3-sdk';
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
import ISwapRouterArtifact from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
import { POOL_FACTORY_CONTRACT_ADDRESS } from "@/lib/constants";
import { SWAP_ROUTER_ADDRESS } from "@uniswap/smart-order-router";

interface Immutables {
  token0: string;
  token1: string;
  fee: number;
}

interface State {
  liquidity: ethers.BigNumber;
  sqrtPriceX96: ethers.BigNumber;
  tick: number;
}

const useSwap = (fromTokenAddress: string, toTokenAddress: string) => {
  const chainId = useChainId();
  const { address } = useAccount();
  let provider = DEPRECATED_RPC_PROVIDERS[chainId];

  let contractIn = new ethers.Contract(fromTokenAddress, ERC20_abi, provider);
  let contractOut = new ethers.Contract(toTokenAddress, ERC20_abi, provider);
  let tokenIn: Token, tokenOut: Token, poolAddress: string;
  let poolContract: any;
  let balanceTokenIn: string, balanceTokenOut: string;

  const getTokenAndBalance = async function (contract: ethers.Contract) {
    var [dec, symbol, name, balance] = await Promise.all(
      [
        contract.decimals(),
        contract.symbol(),
        contract.name(),
        contract.balanceOf(address)
      ]);

    return [new Token(chainId, contract.address, dec, symbol, name), balance];
  }

  const init = async () => {
    contractIn = new ethers.Contract(fromTokenAddress, ERC20_abi, provider);
    contractOut = new ethers.Contract(toTokenAddress, ERC20_abi, provider);
    
    [tokenIn, balanceTokenIn] = await getTokenAndBalance(contractIn);
    [tokenOut, balanceTokenOut] = await getTokenAndBalance(contractOut);
 
    poolAddress = computePoolAddress({ factoryAddress: V3_CORE_FACTORY_ADDRESSES[chainId], tokenA: tokenIn, tokenB: tokenOut, fee: 3000,initCodeHashManualOverride: POOL_INIT_CODE_HASH });

    poolContract = new ethers.Contract(poolAddress, IUniswapV3Pool.abi, provider);
  }

  const swap = async (amount: number) => {
    await init();

    const immutables = await getPoolImmutables();

    const parsedAmount = ethers.utils.parseUnits(amount.toString(), tokenOut.decimals);
    const params = {
      tokenIn: fromTokenAddress,
      tokenOut: toTokenAddress,
      fee: immutables.fee,
      recipient: address,
      // deadline: Math.floor(Date.now() / 1000) + 60 * 10,
      amountIn: parsedAmount.toString(),
      amountOutMinimum: 0,
      sqrtPriceLimitX96: 0
    };
    return params;
  }

  const getQuote = async (amount: number) => {
    await init();
    const [immutables, state ] = await Promise.all([getPoolImmutables(), getPoolState()]); 

    const pool = new Pool(
      tokenIn,
      tokenOut,
      immutables.fee,
      state.sqrtPriceX96.toString(),
      state.liquidity.toString(),
      state.tick
    );    
    const outputAmount = amount * parseFloat(pool.token1Price.toFixed(2));

    return outputAmount;
  }

  const getPoolImmutables = async () => {

    if (!poolContract) throw new Error('Pool contract has not been initialized');

    const [token0, token1, fee] = await Promise.all([poolContract.token0(), poolContract.token1(), poolContract.fee()]);

    const immutables: Immutables = {
      token0,
      token1,
      fee
    };
    
    return immutables;
  };

  const getPoolState = async () => {
    if (!poolContract) throw new Error('Pool contract has not been initialized');

    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);

    const PoolState: State = {
      liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1]
    };

    return PoolState;
  };

  return { swap, getQuote };
};

export default useSwap;