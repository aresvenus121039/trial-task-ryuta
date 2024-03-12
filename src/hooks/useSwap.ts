// import { ethers } from 'ethers';
// import { useContractRead, useContractWrite, useAccount } from 'wagmi';
// import { goerli } from 'wagmi/chains';
// import { Pool } from '@uniswap/v3-sdk';
// import { Token } from '@uniswap/sdk-core';
// import IUniswapV3PoolArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json';
// import ISwapRouterArtifact from '@uniswap/v3-periphery/artifacts/contracts/interfaces/ISwapRouter.sol/ISwapRouter.json';
// import IUniswapV3FactoryArtifact from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Factory.sol/IUniswapV3Factory.json';

// import useFromToken from './useFromToken';

// interface Immutables {
//   token0: string;
//   token1: string;
//   fee: number;
// }

// interface State {
//   liquidity: ethers.BigNumber;
//   sqrtPriceX96: ethers.BigNumber;
//   tick: number;
// }

// const FROM_TOKEN_DECIMALS = 18;
// const TO_TOKEN_DECIMALS = 18;

// const UNI_FACTORY_ADDRESS = '0x1F98431c8aD98523631AE4a59f267346ea31F984';
// const ROUTER_ADDRESS = '0xE592427A0AEce92De3Edee1F18E0157C05861564';

// const useSwap = (fromTokenAddress: string, toTokenAddress: string) => {
//   const { address } = useAccount();
//   const {data: poolAddress} = useContractRead({
//     address: UNI_FACTORY_ADDRESS,
//     abi: IUniswapV3FactoryArtifact.abi,
//     functionName: 'getPool',
//     args: [fromTokenAddress, toTokenAddress, 3000]
//   })
//   const { approve } = useFromToken(fromTokenAddress);

//   const swap = async (amount: number) => {

//     await approve(ROUTER_ADDRESS, amount);

//     const immutables = await getPoolImmutables();

//     const parsedAmount = ethers.utils.parseUnits(amount.toString(), TO_TOKEN_DECIMALS);

//     const params = {
//       tokenIn: fromTokenAddress,
//       tokenOut: toTokenAddress,
//       fee: immutables.fee,
//       recipient: address,
//       deadline: Math.floor(Date.now() / 1000) + 60 * 10,
//       amountIn: parsedAmount,
//       amountOutMinimum: 0,
//       sqrtPriceLimitX96: 0
//     };

//     const {data: txn, isError} = useContractWrite({
//       address: ROUTER_ADDRESS,
//       abi: ISwapRouterArtifact.abi,
//       functionName: 'exactInputSingle',
//       args: [params, {gasLimit: ethers.utils.hexlify(700000)}]
//     })
//     if(isError) throw new Error('Router contract has not been initialized');

//     return txn;
//   };

//   const getQuote = async (amount: number) => {
//     const {data: immutables} = useContractWrite({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'getPoolImmutables'
//     });
//     const {data: state} = useContractWrite({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'getPoolState'
//     });

//     const tokenA = new Token(goerli.id, toTokenAddress, TO_TOKEN_DECIMALS);
//     const tokenB = new Token(goerli.id, fromTokenAddress, FROM_TOKEN_DECIMALS);

//     const pool = new Pool(
//       tokenA,
//       tokenB,
//       immutables.fee,
//       state.sqrtPriceX96.toString(),
//       state.liquidity.toString(),
//       state.tick
//     );

//     const outputAmount = amount * parseFloat(pool.token1Price.toFixed(2));

//     return outputAmount;
//   };

//   const getPoolImmutables = async () => {

//     const {data: token0} = useContractRead({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'token0'
//     })

//     const {data: token1} = useContractRead({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'token1'
//     })

//     const {data: fee} = useContractRead({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'fee'
//     })

//     const immutables: Immutables = {
//       token0,
//       token1,
//       fee
//     };
//     return immutables;
//   };

//   const getPoolState = async () => {

//     const {data: liquidity} = useContractWrite({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'liquidity'
//     })

//     const {data: slot} = useContractWrite({
//       address: poolAddress,
//       abi: IUniswapV3PoolArtifact.abi,
//       functionName: 'token0'
//     })

//     const PoolState: State = {
//       liquidity,
//       sqrtPriceX96: slot[0],
//       tick: slot[1]
//     };

//     return PoolState;
//   };

//   return { swap, getQuote };
// };

// export default useSwap;