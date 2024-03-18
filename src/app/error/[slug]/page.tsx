"use client"

import { redirect, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount } from "wagmi"
import { ConnectButton } from "@rainbow-me/rainbowkit";

const WalletError = () => {
  const { isConnected } = useAccount()
  const params = useParams()
  
  useEffect(() => {
    if(isConnected)
      redirect('/uniswaphook')
  },[isConnected])
  return(
    <div className="w-full h-full flex justify-center items-center">
      {
        params.slug == 'walletconnect' ? (
          <div className="flex flex-col justify-center items-center gap-3">
            <h1 className="text-rose-500 text-[3rem] mt-10 text-center">You should connect wallet for Swap Page.</h1>
            <ConnectButton />
          </div>
        ) : (
          <></>
        )
      }
    </div>
  )
}

export default WalletError