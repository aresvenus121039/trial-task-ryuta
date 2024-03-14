// This endpoint begins the authorisation flow.   /https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
// It redirects the user to gmail APIs to extract the authorisation code.
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";
import { CHAIN_SUBGRAPH_URL_NOT_TEST } from '@/lib/constants';

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { amount, name, chainId } = await req.json();    
    try {
        const data = await axios({
            url: CHAIN_SUBGRAPH_URL_NOT_TEST[chainId] ?? CHAIN_SUBGRAPH_URL_NOT_TEST[1],
            method: "post",
            data: {
                query: `
                query GET($amount: Int!, $name: String!) {
                    
                  tokens(first: $amount,orderBy: volumeUSD, orderDirection: desc) {
                    decimals
                    name
                    symbol
                    id
                    volume
                    volumeUSD
                    tokenDayData(first: 2, orderBy: date, orderDirection: desc) {
                      priceUSD
                      volume
                      high
                      low
                      date
                      open
                    }
                    totalSupply
                  }
                
              }
                `,
              variables: {amount: amount, name: name}
            }
        });
        
        return NextResponse.json({
            data: data.data.data.tokens
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {
            status: 500
        })
    }
};
