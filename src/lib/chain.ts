import { ChainId, SupportedChainsType } from '@uniswap/sdk-core'

export enum RPCType {
  Public = 'public',
  Private = 'private',
  PublicAlt = 'public_alternative',
}

export const CHAIN_IDS_TO_NAMES = {
  [ChainId.MAINNET]: 'mainnet',
  [ChainId.GOERLI]: 'goerli',
  [ChainId.SEPOLIA]: 'sepolia',
  [ChainId.POLYGON]: 'polygon',
  [ChainId.POLYGON_MUMBAI]: 'polygon_mumbai',
  [ChainId.CELO]: 'celo',
  [ChainId.CELO_ALFAJORES]: 'celo_alfajores',
  [ChainId.ARBITRUM_ONE]: 'arbitrum',
  [ChainId.ARBITRUM_GOERLI]: 'arbitrum_goerli',
  [ChainId.OPTIMISM]: 'optimism',
  [ChainId.OPTIMISM_GOERLI]: 'optimism_goerli',
  [ChainId.BNB]: 'bnb',
  [ChainId.AVALANCHE]: 'avalanche',
  [ChainId.BASE]: 'base',
} as const


// TODO: include BASE_GOERLI, OPTIMISM_SEPOLIA, or ARBITRUM_SEPOLIA when routing is implemented
export type SupportedInterfaceChain = Exclude<
  SupportedChainsType,
  ChainId.BASE_GOERLI | ChainId.ARBITRUM_SEPOLIA | ChainId.OPTIMISM_SEPOLIA
>

// // Renamed from SupportedChainId in web app
// export enum ChainId {
//   Mainnet = 1,
//   Goerli = 5,

//   ArbitrumOne = 42161,
//   Base = 8453,
//   Optimism = 10,
//   Polygon = 137,
//   PolygonMumbai = 80001,
//   Bnb = 56,
// }

export const ALL_SUPPORTED_CHAINS: string[] = Object.values(ChainId).map((c) => c.toString())

// DON'T CHANGE - order here determines ordering of networks in app
// TODO: [MOB-250] Add back in testnets once our endpoints support them
export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = [
  ChainId.MAINNET,
  ChainId.POLYGON,
  ChainId.ARBITRUM_ONE,
  ChainId.OPTIMISM,
  ChainId.BASE,
  ChainId.BNB,
]

export const TESTNET_CHAIN_IDS = [ChainId.GOERLI, ChainId.POLYGON_MUMBAI]

export const ETHEREUM_CHAIN_IDS = [ChainId.MAINNET, ChainId.GOERLI] as const

// Renamed from SupportedL1ChainId in web app
export type EthereumChainId = (typeof ETHEREUM_CHAIN_IDS)[number]

export const CHAIN_INFO: any = {
  [ChainId.ARBITRUM_ONE]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://arb1.arbitrum.io/rpc' },
  },
  [ChainId.MAINNET]: {
    rpcUrls: { [RPCType.Private]: 'https://rpc.mevblocker.io/?referrer=uniswapwallet' },
  },
  [ChainId.GOERLI]: {
    
  },
  [ChainId.BASE]: {
    rpcUrls: { [RPCType.Public]: 'https://mainnet.base.org' },
  },
  [ChainId.BNB]: {
    rpcUrls: { [RPCType.Public]: 'https://api.uniswap.org' },
  },
  [ChainId.OPTIMISM]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://mainnet.optimism.io' },
    statusPage: 'https://optimism.io/status',
  },
  [ChainId.POLYGON]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://polygon-rpc.com/' },
  },
  [ChainId.POLYGON_MUMBAI]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://rpc-endpoints.superfluid.dev/mumbai' },
  },
}
