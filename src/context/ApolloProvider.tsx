"use client"

import { ApolloClient, InMemoryCache, HttpLink } from '@apollo/client';
import { ApolloProvider } from '@apollo/react-hooks';
import { useChainId  } from 'wagmi';
import { CHAIN_SUBGRAPH_URL } from '@/lib/constants';

export default function Providers({ children }: { children: React.ReactNode }) {
  const chainId = useChainId();
  
  const apolloClient = new ApolloClient({
    link: new HttpLink({
      uri: CHAIN_SUBGRAPH_URL[chainId] ?? CHAIN_SUBGRAPH_URL[1]
    }),
    cache: new InMemoryCache()
  });

  return (
    <ApolloProvider client={apolloClient}>
      {children}
    </ApolloProvider>
  );
}
