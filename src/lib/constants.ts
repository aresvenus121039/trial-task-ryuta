/////////-------Mainnet, Goerli, Arbitrum, Optimism, Polygon Address-----/////////////////

export const MGAOP_POOL_FACTORY_CONTRACT_ADDRESS =
  '0x1F98431c8aD98523631AE4a59f267346ea31F984'
export const MGAOP_QUOTER_CONTRACT_ADDRESS =
  '0xb27308f9F90D607463bb33eA1BeBb41C27CE5AB6'
export const MGAOP_SWAP_ROUTER_02_ADDRESS = 
  '0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45'


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
