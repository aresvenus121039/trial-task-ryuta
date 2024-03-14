// This endpoint begins the authorisation flow. https://api.thegraph.com/subgraphs/name/ianlapham/uniswap-v3-gorli
// It redirects the user to gmail APIs to extract the authorisation code.
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export const POST = async (req: NextRequest, res: NextResponse) => {
  const { amount } = await req.json();    
  try {
    const data = await axios({
      url: "https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3",
      method: "post",
      data: {
          query: `
          query GET($amount: Int!) {
              
            tokens(orderBy: volumeUSD, orderDirection: desc, first: $amount) {
              decimals
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
        variables: {amount: amount}
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
