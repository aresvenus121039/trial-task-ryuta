export enum RPCType {
  Public = 'public',
  Private = 'private',
  PublicAlt = 'public_alternative',
}

// Renamed from SupportedChainId in web app
export enum ChainId {
  Mainnet = 1,
  Goerli = 5,

  ArbitrumOne = 42161,
  Base = 8453,
  Optimism = 10,
  Polygon = 137,
  PolygonMumbai = 80001,
  Bnb = 56,
}

export const ALL_SUPPORTED_CHAINS: string[] = Object.values(ChainId).map((c) => c.toString())

// DON'T CHANGE - order here determines ordering of networks in app
// TODO: [MOB-250] Add back in testnets once our endpoints support them
export const ALL_SUPPORTED_CHAIN_IDS: ChainId[] = [
  ChainId.Mainnet,
  ChainId.Polygon,
  ChainId.ArbitrumOne,
  ChainId.Optimism,
  ChainId.Base,
  ChainId.Bnb,
]

export const TESTNET_CHAIN_IDS = [ChainId.Goerli, ChainId.PolygonMumbai]

export const ETHEREUM_CHAIN_IDS = [ChainId.Mainnet, ChainId.Goerli] as const

// Renamed from SupportedL1ChainId in web app
export type EthereumChainId = (typeof ETHEREUM_CHAIN_IDS)[number]

export const CHAIN_INFO: any = {
  [ChainId.ArbitrumOne]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://arb1.arbitrum.io/rpc' },
  },
  [ChainId.Mainnet]: {
    rpcUrls: { [RPCType.Private]: 'https://rpc.mevblocker.io/?referrer=uniswapwallet' },
  },
  [ChainId.Goerli]: {
    
  },
  [ChainId.Base]: {
    rpcUrls: { [RPCType.Public]: 'https://mainnet.base.org' },
  },
  [ChainId.Bnb]: {
    rpcUrls: { [RPCType.Public]: 'https://api.uniswap.org' },
  },
  [ChainId.Optimism]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://mainnet.optimism.io' },
    statusPage: 'https://optimism.io/status',
  },
  [ChainId.Polygon]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://polygon-rpc.com/' },
  },
  [ChainId.PolygonMumbai]: {
    rpcUrls: { [RPCType.PublicAlt]: 'https://rpc-endpoints.superfluid.dev/mumbai' },
  },
}
