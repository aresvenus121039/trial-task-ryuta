
// Uniswap and Web3 modules
import { ethers, providers as ethersProviders, Signer, VoidSigner } from "ethers";
import QuoterABI from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import { Pool, computePoolAddress, Route as V3Route, FACTORY_ADDRESS } from '@uniswap/v3-sdk/'
import { TradeType, Token, CurrencyAmount, Percent, ChainId, SWAP_ROUTER_02_ADDRESSES, QUOTER_ADDRESSES } from '@uniswap/sdk-core'
import { AlphaRouter, log } from '@uniswap/smart-order-router'
import IUniswapV3Pool from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import IUniswapV3Factory from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json'
import { BigNumber } from '@ethersproject/bignumber';
import {  CHAIN_INFO, RPCType } from "@/lib/chain";

import ERC20_abi from "./abis/ERC20_abi.json"
import ERC721_abi from "./abis/ERC721_abi.json"
import { POOL_FACTORY_CONTRACT_ADDRESS, QUOTER_CONTRACT_ADDRESS } from "@/lib/constants";
import { DEPRECATED_RPC_PROVIDERS } from "@/lib/providers";

export type InfuraChainName =
  | 'homestead'
  | 'goerli'
  | 'arbitrum'
  | 'base'
  | 'bnbsmartchain-mainnet'
  | 'optimism'
  | 'matic'
  | 'maticmum'

export function getInfuraChainName(chainId: ChainId): InfuraChainName {
  switch (chainId) {
    case ChainId.MAINNET:
      return 'homestead'
    case ChainId.GOERLI:
      return 'goerli'
    case ChainId.ARBITRUM_ONE:
      return 'arbitrum'
    case ChainId.BASE:
      return 'base'
    case ChainId.BNB:
      return 'bnbsmartchain-mainnet'
    case ChainId.OPTIMISM:
      return 'optimism'
    case ChainId.POLYGON:
      return 'matic'
    case ChainId.POLYGON_MUMBAI:
      return 'maticmum'
    default:
      throw new Error(`Unsupported eth infura chainId for ${chainId}`)
  }
}

export function createEthersProvider(
  chainId: ChainId,
  rpcType: RPCType = RPCType.Public
): ethersProviders.JsonRpcProvider | null {
  try {
    if (rpcType === RPCType.Private) {
      const privateRPCUrl = CHAIN_INFO[chainId].rpcUrls?.[RPCType.Private]
      if (!privateRPCUrl) {
        throw new Error(`No private RPC available for chain ${chainId}`)
      }
      return new ethersProviders.JsonRpcProvider(privateRPCUrl)
    }

    try {
      const publicRPCUrl = CHAIN_INFO[chainId].rpcUrls?.[RPCType.Public]
      if (publicRPCUrl) {
        return new ethersProviders.JsonRpcProvider(publicRPCUrl)
      }

      return new ethersProviders.InfuraProvider(getInfuraChainName(chainId), "9140a8fc9a6546e08aa2001dfbd567dd")
    } catch (error) {
      const altPublicRPCUrl = CHAIN_INFO[chainId].rpcUrls?.[RPCType.PublicAlt]
      return new ethersProviders.JsonRpcProvider(altPublicRPCUrl)
    }
  } catch (error) {
    console.log("error",error);
    return null
  }
}

export const getBalance = async (providerr: any, address: string, chainId: number) => {
  let ethereum = (window as any).ethereum;
  let accounts = await ethereum.request({
    method: "eth_requestAccounts",
  });

  let walletAddress = accounts[0];
  
  let provider = DEPRECATED_RPC_PROVIDERS[chainId];
  if (provider == null) provider = new ethers.providers.Web3Provider(providerr);
  let signer = new VoidSigner(walletAddress, provider);
  // create token contracts and related objects
  let contract = new ethers.Contract(address, ERC20_abi, provider);

  let getTokenAndBalance = async function (contract: ethers.Contract) {
    var [dec, symbol, name, balance] = await Promise.all(
      [
        contract.decimals(),
        contract.symbol(),
        contract.name(),
        contract.balanceOf(walletAddress as `0x${string}`)
      ]);

    return [new Token(chainId, contract.address, dec, symbol, name), balance];
  }

  let [_, balance] = await getTokenAndBalance(contract);
  const bigNumberDec = ethers.BigNumber.from(balance).toString();
console.log(ethers.utils.formatUnits(balance, _.decimals));

  return ethers.utils.formatUnits(balance, _.decimals)
}

export const initswap = async (tokenInContractAddress: string, tokenOutContractAddress: string, providerr: any, walletAddresss: any, chainId: number, inAmountStr: any) => {

  let provider = DEPRECATED_RPC_PROVIDERS[chainId];
  let signer = new VoidSigner(walletAddresss, provider);

  // create token contracts and related objects
  const contractIn = new ethers.Contract(tokenInContractAddress, ERC20_abi, provider);
  const contractOut = new ethers.Contract(tokenOutContractAddress, ERC20_abi, provider);

  const getTokenAndBalance = async function (contract: ethers.Contract) {
    var [dec, symbol, name, balance] = await Promise.all(
      [
        contract.decimals(),
        contract.symbol(),
        contract.name(),
        contract.balanceOf(walletAddresss)
      ]);

    return [new Token(chainId, contract.address, dec, symbol, name), balance];
  }


  const [tokenIn, balanceTokenIn] = await getTokenAndBalance(contractIn);
  const [tokenOut, balanceTokenOut] = await getTokenAndBalance(contractOut);

  console.log(`Wallet ${walletAddresss} balances:`);
  console.log(`   Input: ${tokenIn.symbol} (${tokenIn.name}): ${ethers.utils.formatUnits(balanceTokenIn, tokenIn.decimals)}`);
  console.log(`   Output: ${tokenOut.symbol} (${tokenOut.name}): ${ethers.utils.formatUnits(balanceTokenOut, tokenOut.decimals)}`);
  console.log("");

  console.log("Loading pool information...");

  const poolAddress = computePoolAddress({ factoryAddress:FACTORY_ADDRESS[chainId], tokenA: tokenIn, tokenB: tokenOut, fee: 3000 })
  console.log(poolAddress);
  
  if (Number(poolAddress).toString() === "0") // there is no such pool for provided In-Out tokens.
    throw `Error: No pool ${tokenIn.symbol}-${tokenOut.symbol}`;

  const poolContract = new ethers.Contract(poolAddress, IUniswapV3Pool.abi, provider);

  const getPoolState = async function () {
    const [liquidity, slot] = await Promise.all([poolContract.liquidity(), poolContract.slot0()]);

    return {
      liquidity: liquidity,
      sqrtPriceX96: slot[0],
      tick: slot[1],
      observationIndex: slot[2],
      observationCardinality: slot[3],
      observationCardinalityNext: slot[4],
      feeProtocol: slot[5],
      unlocked: slot[6],
    }
  }

  const getPoolImmutables = async function () {
    const [factory, token0, token1, fee, tickSpacing, maxLiquidityPerTick] = await Promise.all([
      poolContract.factory(),
      poolContract.token0(),
      poolContract.token1(),
      poolContract.fee(),
      poolContract.tickSpacing(),
      poolContract.maxLiquidityPerTick(),
    ]);

    return {
      factory: factory,
      token0: token0,
      token1: token1,
      fee: fee,
      tickSpacing: tickSpacing,
      maxLiquidityPerTick: maxLiquidityPerTick,
    }
  }

  // loading immutable pool parameters and its current state (variable parameters)
  const [immutables, state] = await Promise.all([getPoolImmutables(), getPoolState()]);

  const pool = new Pool(
    tokenIn,
    tokenOut,
    immutables.fee,
    state.sqrtPriceX96.toString(),
    state.liquidity.toString(),
    state.tick
  );

  // print token prices in the pool
  console.log("Token prices in pool:");
  console.log(`   1 ${pool.token0.symbol} = ${pool.token0Price.toSignificant()} ${pool.token1.symbol}`);
  console.log(`   1 ${pool.token1.symbol} = ${pool.token1Price.toSignificant()} ${pool.token0.symbol}`);
  console.log('');


  console.log("Loading up quote for a swap...");

  const amountIn = ethers.utils.parseUnits(inAmountStr.toString(), tokenIn.decimals);

  // this is Uniswap quoter smart contract, same address on all chains
  // (from https://docs.uniswap.org/protocol/reference/deployments)
  // const UNISWAP_QUOTER_ADDRESS = '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
  
  const quoterContract = new ethers.Contract(QUOTER_ADDRESSES[chainId], QuoterABI.abi, provider);

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    tokenIn.address as `0x${string}`,
    tokenOut.address as `0x${string}`,
    pool.fee,
    amountIn,
    0
  );

  console.log(`   You'll get approximately ${ethers.utils.formatUnits(quotedAmountOut, tokenOut.decimals)} ${tokenOut.symbol} for ${inAmountStr} ${tokenIn.symbol}`);
  console.log('');


  // =============
  console.log('');
  console.log("Loading a swap route...");

  const inAmount = CurrencyAmount.fromRawAmount(tokenIn, amountIn.toString());

  const router = new AlphaRouter({ chainId: tokenIn.chainId, provider: provider });
  const route = await router.route(
    inAmount,
    tokenOut,
    TradeType.EXACT_INPUT,
    // swapOptions
    {
      recipient : walletAddresss,
      slippageTolerance: new Percent(5, 100),          // Big slippage – for a test
      deadline: Math.floor(Date.now() / 1000 + 1800)    // add 1800 seconds – 30 mins deadline
    },
    // router config
    {
      // only one direct swap for a reason – 2 swaps thru DAI (USDT->DAI->WETH) didn't work on Rinkeby
      // There was an overflow problem https://rinkeby.etherscan.io/tx/0xaed297f2f51f17b329ce755b11635980268f3fc88aae10e78cf59f2c6e65ca7f
      // The was DAI balance for UniswapV2Pair was greater than 2^112-1 (https://github.com/Uniswap/v2-core/blob/master/contracts/UniswapV2Pair.sol)
      // UniswapV2Pair – https://rinkeby.etherscan.io/address/0x8b22f85d0c844cf793690f6d9dfe9f11ddb35449
      // WETH – https://rinkeby.etherscan.io/address/0xc778417e063141139fce010982780140aa0cd5ab#readContract
      // DAI – https://rinkeby.etherscan.io/address/0xc7ad46e0b8a400bb3c915120d284aafba8fc4735#readContract (balance of UniswapV2Pair more than 2^112-1)

      maxSwapsPerPath: 1 // remove this if you want multi-hop swaps as well.
    }
  );

  if (route == null || route.methodParameters === undefined)
    throw "No route loaded";

  console.log(`   You'll get ${route.quote.toFixed()} of ${tokenOut.symbol}`);

  // output quote minus gas fees
  console.log(`   Gas Adjusted Quote: ${route.quoteGasAdjusted.toFixed()}`);
  console.log(`   Gas Used Quote Token: ${route.estimatedGasUsedQuoteToken.toFixed()}`);
  console.log(`   Gas Used USD: ${route.estimatedGasUsedUSD.toFixed()}`);
  console.log(`   Gas Used: ${route.estimatedGasUsed.toString()}`);
  console.log(`   Gas Price Wei: ${route.gasPriceWei}`);
  console.log('');

  console.log([
    contractIn,
    contractOut,
    signer,
    route,
    provider,
    balanceTokenIn,
    balanceTokenOut
  ]);
  
  return [
    contractIn,
    contractOut,
    signer,
    route,
    provider,
    balanceTokenIn,
    balanceTokenOut
  ];
}

export const approveForSwap = async (contractIn: any, contractOut: any, walletAddress: any, chainId: any, amountIn: any, provider: any, signer: any) => {
  // here we just create a transaction object (not sending it to blockchain).
  const approveTxUnsigned = await contractIn.populateTransaction.approve(SWAP_ROUTER_02_ADDRESSES(chainId), amountIn);
  // by default chainid is not set https://ethereum.stackexchange.com/questions/94412/valueerror-code-32000-message-only-replay-protected-eip-155-transac
  approveTxUnsigned.chainId = chainId;
  // estimate gas required to make approve call (not sending it to blockchain either)
  approveTxUnsigned.gasLimit = await contractIn.estimateGas.approve(SWAP_ROUTER_02_ADDRESSES(chainId), amountIn);
  // suggested gas price (increase if you want faster execution)
  approveTxUnsigned.gasPrice = await provider.getGasPrice();
  // nonce is the same as number previous transactions
  approveTxUnsigned.nonce = await provider.getTransactionCount(walletAddress);

  // sign transaction by our signer
  const approveTxSigned = await signer.signTransaction(approveTxUnsigned);
  // submit transaction to blockchain
  const submittedTx = await provider.sendTransaction(approveTxSigned);
  // wait till transaction completes
  const approveReceipt = await submittedTx.wait();
  if (approveReceipt.status === 0)
    throw new Error("Approve transaction failed");

  return [
    signer,
    contractIn,
    contractOut
  ]
}

export const makeswap = async (walletAddress: any, route: any, signer: any, contractIn: any, contractOut: any, chainId: any) => {
  console.log("Making a swap...");
  const value = BigNumber.from(route.methodParameters.value);

  const transaction = {
    data: route.methodParameters.calldata,
    to: SWAP_ROUTER_02_ADDRESSES(chainId),
    value: value,
    from: walletAddress,
    gasPrice: route.gasPriceWei,

    // route.estimatedGasUsed might be too low!
    // most of swaps I tested fit into 300,000 but for some complex swaps this gas is not enough.
    // Loot at etherscan/polygonscan past results.
    gasLimit: BigNumber.from("800000")
  };

  var tx = await signer.sendTransaction(transaction);
  const receipt = await tx.wait();
  if (receipt.status === 0) {
    throw new Error("Swap transaction failed");
  }

  // ============= Final part --- printing results
  const [newBalanceIn, newBalanceOut] = await Promise.all([
    contractIn.balanceOf(walletAddress),
    contractOut.balanceOf(walletAddress)
  ]);

  return [
    newBalanceIn,
    newBalanceOut
  ]
}
