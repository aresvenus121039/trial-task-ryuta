// This endpoint begins the authorisation flow.   /https://api.thegraph.com/subgraphs/name/uniswap/uniswap-v3
// It redirects the user to gmail APIs to extract the authorisation code.
import axios from "axios";
import { NextResponse, NextRequest } from "next/server";

export const GET = async (req: NextRequest, res: NextResponse) => {
    try {
        const res = await axios({
            url: "https://cloudflare-ipfs.com/ipns/tokens.uniswap.org",
            method: "get",
        });
        
        return NextResponse.json({
          data: res.data
        })

    } catch (error: any) {
        return NextResponse.json({ error: error.message }, {
            status: 500
        })
    }
};
