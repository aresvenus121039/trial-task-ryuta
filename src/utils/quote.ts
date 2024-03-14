import { ethers, providers } from 'ethers'
import { computePoolAddress, FeeAmount } from '@uniswap/v3-sdk'
import { Token } from '@uniswap/sdk-core'
import Quoter from '@uniswap/v3-periphery/artifacts/contracts/lens/Quoter.sol/Quoter.json'
import IUniswapV3PoolABI from '@uniswap/v3-core/artifacts/contracts/interfaces/IUniswapV3Pool.sol/IUniswapV3Pool.json'
import {
  MGAOP_POOL_FACTORY_CONTRACT_ADDRESS,
  MGAOP_QUOTER_CONTRACT_ADDRESS,
} from '../lib/constants'
import { toReadableAmount, fromReadableAmount } from '../lib/conversion'

function getProvider(): providers.Provider {
  return new ethers.providers.JsonRpcProvider('goerli')
}

export async function quotes(amountIn: number, decimalsIn: number, decimalsOut: number, tokenIn: Token, tokenOut: Token): Promise<string> {
  const quoterContract = new ethers.Contract(
    MGAOP_QUOTER_CONTRACT_ADDRESS,
    Quoter.abi,
    getProvider()
  )
  const poolConstants = await getPoolConstants(tokenIn, tokenOut)

  const quotedAmountOut = await quoterContract.callStatic.quoteExactInputSingle(
    poolConstants.token0,
    poolConstants.token1,
    poolConstants.fee,
    fromReadableAmount(
      amountIn,
      decimalsIn
    ).toString(),
    0
  )

  return toReadableAmount(quotedAmountOut, decimalsOut)
}

async function getPoolConstants(tokenIn: Token, tokenOut: Token): Promise<{
  token0: string
  token1: string
  fee: number
}> {
  const currentPoolAddress = computePoolAddress({
    factoryAddress: MGAOP_POOL_FACTORY_CONTRACT_ADDRESS,
    tokenA: tokenIn,
    tokenB: tokenOut,
    fee: FeeAmount.MEDIUM,
  })

  const poolContract = new ethers.Contract(
    currentPoolAddress,
    IUniswapV3PoolABI.abi,
    getProvider()
  )
  const [token0, token1, fee] = await Promise.all([
    poolContract.token0(),
    poolContract.token1(),
    poolContract.fee(),
  ])

  return {
    token0,
    token1,
    fee,
  }
}
