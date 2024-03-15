"use client"

import { redirect, useParams } from 'next/navigation'
import { useEffect } from 'react'
import { useAccount } from "wagmi"

const WalletError = () => {
  const { isConnected } = useAccount()
  const params = useParams()
  
  useEffect(() => {
    if(isConnected)
      redirect('/')
  },[isConnected])
  return(
    <div className="w-full h-full flex justify-center items-center">
      {
        params.slug == 'walletconnect' ? (
          <h1 className="text-rose-500 text-[50px] mt-10">You should connect wallet for Swap Page.</h1>
        ) : (
          <></>
        )
      }
    </div>
  )
}

export default WalletError