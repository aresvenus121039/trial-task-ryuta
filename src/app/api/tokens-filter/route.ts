// This endpoint begins the authorisation flow.
// It redirects the user to gmail APIs to extract the authorisation code.
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
    const { name } = await req.json();    
    try {
        const data = await axios({
            url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
            method: "post",
            data: {
                query: `
                query GET($name: String!) {
                    
                  tokens(where: {symbol: $name}) {
                    name
                    symbol
                    id
                    volume
                    volumeUSD
                    tokenDayData(first: 1, orderBy: priceUSD, orderDirection: desc) {
                      priceUSD
                      volume
                      high
                      low
                      date
                      open
                    }
                  }
                
              }
                `,
              variables: { name: name}
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
