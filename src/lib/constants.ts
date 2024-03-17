import { ChainId } from '@uniswap/sdk-core'

export const POOL_FACTORY_CONTRACT_ADDRESS : Record<number, string> = {
  [ChainId.MAINNET] : '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.GOERLI] : '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.ARBITRUM_ONE] : '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.OPTIMISM] : '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.POLYGON] : '0x1F98431c8aD98523631AE4a59f267346ea31F984',
  [ChainId.SEPOLIA] : '0x0227628f3F023bb0B980b67D528571c95c6DaC1c',
  [ChainId.CELO] : '0xAfE208a311B21f13EF87E33A90049fC17A7acDEc',
  [ChainId.BNB] : '0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7',
  [ChainId.BASE] : '0x33128a8fC17869897dcE68Ed026d694621f6FDfD'
}

export const QUOTER_CONTRACT_ADDRESS : Record<number, string> = {
  [ChainId.MAINNET] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.GOERLI] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.ARBITRUM_ONE] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.OPTIMISM] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.POLYGON] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.SEPOLIA] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.CELO] : '0x82825d0554fA07f7FC52Ab63c961F330fdEFa8E8',
  [ChainId.BNB] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6',
  [ChainId.BASE] : '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
}

export const SWAP_ROUTER_02_CONTRACT_ADDRESS : Record<number, string> = {
  [ChainId.MAINNET] : '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  [ChainId.GOERLI] : '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  [ChainId.ARBITRUM_ONE] : '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  [ChainId.OPTIMISM] : '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  [ChainId.POLYGON] : '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45',
  [ChainId.SEPOLIA] : '0x3bFA4769FB09eefC5a80d6E87c3B9C650f7Ae48E',
  [ChainId.CELO] : '0x5615CDAb10dc425a742d643d949a7F474C01abc4',
  [ChainId.BNB] : '0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2',
  [ChainId.BASE] : '0x2626664c2603336E57B271c5C0b26F421741e481'
}

export const SWAP_ROUTER_CONTRACT_ADDRESS : Record<number, string> = {
  [ChainId.MAINNET] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.GOERLI] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.ARBITRUM_ONE] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.OPTIMISM] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.POLYGON] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.SEPOLIA] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.CELO] : '0x5615CDAb10dc425a742d643d949a7F474C01abc4',
  [ChainId.BNB] : '0xE592427A0AEce92De3Edee1F18E0157C05861564',
  [ChainId.BASE] : '0xE592427A0AEce92De3Edee1F18E0157C05861564'
}


export const CHAIN_SUBGRAPH_URL_NOT_TEST: Record<number, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap',  //MAINNET
  56: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc?source=uniswap', //bnb
  43114: 'https://api.thegraph.com/subgraphs/name/lynnshaoyu/uniswap-v3-avax?source=uniswap', // Avalanche C-Chain,
}
export const CHAIN_SUBGRAPH_URL: Record<number, string> = {
  1: 'https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3?source=uniswap',  //MAINNET
  5: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-gorli',   //Georli
  42161: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-arbitrum-one?source=uniswap', ///arbitrum
  137: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-polygon?source=uniswap',  //polygon
  42220: 'https://api.thegraph.com/subgraphs/name/jesse-sawa/uniswap-celo?source=uniswap', //celo
  56: 'https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-bsc?source=uniswap', //bnb
  43114: 'https://api.thegraph.com/subgraphs/name/lynnshaoyu/uniswap-v3-avax?source=uniswap', // Avalanche C-Chain,
  8453: 'https://api.studio.thegraph.com/query/48211/uniswap-v3-base/version/latest?source=uniswap',    //base
}

export const UNI_LIST = 'https://cloudflare-ipfs.com/ipns/tokens.uniswap.org'
export const UNI_EXTENDED_LIST = 'https://cloudflare-ipfs.com/ipns/extendedtokens.uniswap.org'
const UNI_UNSUPPORTED_LIST = 'https://cloudflare-ipfs.com/ipns/unsupportedtokens.uniswap.org'
const AAVE_LIST = 'tokenlist.aave.eth'
const BA_LIST = 'https://raw.githubusercontent.com/The-Blockchain-Association/sec-notice-list/master/ba-sec-list.json'
// TODO(WEB-2282): Re-enable CMC list once we have a better solution for handling large lists.
// const CMC_ALL_LIST = 'https://s3.coinmarketcap.com/generated/dex/tokens/eth-tokens-all.json'
const COINGECKO_LIST = 'https://tokens.coingecko.com/uniswap/all.json'
const COINGECKO_BNB_LIST = 'https://tokens.coingecko.com/binance-smart-chain/all.json'
const COINGECKO_ARBITRUM_LIST = 'https://tokens.coingecko.com/arbitrum-one/all.json'
const COINGECKO_OPTIMISM_LIST = 'https://tokens.coingecko.com/optimistic-ethereum/all.json'
const COINGECKO_CELO_LIST = 'https://tokens.coingecko.com/celo/all.json'
const COINGECKO_POLYGON_LIST = 'https://tokens.coingecko.com/polygon-pos/all.json'
const COINGECKO_AVAX_LIST = 'https://tokens.coingecko.com/avalanche/all.json'
const COMPOUND_LIST = 'https://raw.githubusercontent.com/compound-finance/token-list/master/compound.tokenlist.json'
const GEMINI_LIST = 'https://www.gemini.com/uniswap/manifest.json'
const KLEROS_LIST = 't2crtokens.eth'
const SET_LIST = 'https://raw.githubusercontent.com/SetProtocol/uniswap-tokenlist/main/set.tokenlist.json'
const WRAPPED_LIST = 'wrapped.tokensoft.eth'

export const OPTIMISM_LIST = 'https://static.optimism.io/optimism.tokenlist.json'
export const ARBITRUM_LIST = 'https://bridge.arbitrum.io/token-list-42161.json'
export const CELO_LIST = 'https://celo-org.github.io/celo-token-list/celo.tokenlist.json'
export const PLASMA_BNB_LIST = 'https://raw.githubusercontent.com/plasmadlt/plasma-finance-token-list/master/bnb.json'
export const AVALANCHE_LIST =
  'https://raw.githubusercontent.com/ava-labs/avalanche-bridge-resources/main/token_list.json'
export const BASE_LIST =
  'https://raw.githubusercontent.com/ethereum-optimism/ethereum-optimism.github.io/master/optimism.tokenlist.json'

export const UNSUPPORTED_LIST_URLS: string[] = [BA_LIST, UNI_UNSUPPORTED_LIST]

// default lists to be 'active' aka searched across
export const DEFAULT_ACTIVE_LIST_URLS: string[] = [UNI_LIST]
export const DEFAULT_INACTIVE_LIST_URLS: string[] = [
  UNI_EXTENDED_LIST,
  COMPOUND_LIST,
  AAVE_LIST,
  //  CMC_ALL_LIST,
  COINGECKO_LIST,
  COINGECKO_BNB_LIST,
  COINGECKO_ARBITRUM_LIST,
  COINGECKO_OPTIMISM_LIST,
  COINGECKO_CELO_LIST,
  COINGECKO_POLYGON_LIST,
  COINGECKO_AVAX_LIST,
  KLEROS_LIST,
  GEMINI_LIST,
  WRAPPED_LIST,
  SET_LIST,
  ARBITRUM_LIST,
  OPTIMISM_LIST,
  CELO_LIST,
  PLASMA_BNB_LIST,
  AVALANCHE_LIST,
  BASE_LIST,
  ...UNSUPPORTED_LIST_URLS,
]

export const DEFAULT_LIST_OF_LISTS: string[] = [...DEFAULT_ACTIVE_LIST_URLS, ...DEFAULT_INACTIVE_LIST_URLS]

