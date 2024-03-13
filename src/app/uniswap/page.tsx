"use client"
import React from 'react';
import { ethers } from 'ethers';
import { useAccount, useBalance, useChainId  } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import {Alchemy, Network} from "alchemy-sdk"
import { initpoolforswap } from '@/utils/swapquote';
import Image from 'next/image';

interface TokenType {
  id: string;
  name: string;
  symbol: string;
  logo?: string;
}

const config = {
  apiKey: "lv9u9bsZ85gMYhfk3c9jyAIixErH-SoZ",
  network: Network.ETH_MAINNET,
};
const alchemy = new Alchemy(config);


const Swap = () => {
  const [amount, setAmount] = React.useState(0);
  const [quote, setQuote] = React.useState(0);
  const [isLoadings, setIsLoading] = React.useState(false);
  const [isExceedBalance, setIsExceedBalance] = React.useState(false);
  const [isInvalidFromToken, setIsInvalidFromToken] = React.useState(false);
  const [isInvalidToToken, setIsInvalidToToken] = React.useState(false);
  const [fromToken, setFromToken] = React.useState('');
  const [toToken, setToToken] = React.useState('');
  const [fromTokenAmount, setFromTokenAmount] = React.useState('');
  const [isOpenSuccess, setIsOpenSuccess] = React.useState(false);
  const [isOpenError, setIsOpenError] = React.useState(false);

  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [selectModal, setSelectModal] = React.useState<number>(0)
  const [tokenlists , setTokenlist] = React.useState<TokenType[]>([])
  const [toTokenSymbolTemp, setToTokenSymbolTemp] = React.useState<string>('')

  const { address } = useAccount();
  const { data: FromTokenBalance } = useBalance({
    address: address,
    // token: fromToken as `0x${string}`,
    watch: true
  });
  const { data: ToTokenBalance } = useBalance({
    address: address,
    // token: toToken as `0x${string}`,
    watch: true
  });

  const chain_id = useChainId()

  React.useEffect(() => {
    const fetchData = async () => {
        setIsLoading(true)
        const requestOptions = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ name: FromTokenBalance?.symbol })
        };
        const response = await fetch('/api/tokens-filter', requestOptions);
        const data = await response.json()
        // setFromToken(data.data[0].id)

        const requestOptionss = {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ amount: 10 })
        };
        const res = await fetch('/api/tokenlists', requestOptionss);
        const datalist = await res.json();
        console.log("here1",datalist.data);
        
        setTokenlist(datalist.data)
        setIsLoading(false);
    }
    fetchData()
  },[])
    
  const onChangeAmountInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const amountIn = parseFloat(event.target.value || '0');
    setFromTokenAmount(event.target.value || '');
    if (amountIn > parseFloat(FromTokenBalance?.formatted || '0')) {
      setIsExceedBalance(true);
    } else {
      setIsExceedBalance(false);
    }

    setAmount(amountIn);
    // const quote = await getQuote(amountIn);
    setQuote(quote);
  };

  const onClickSwapButton = async () => {
    // setShowModal(true);
     const [balancein, balanceout] = await initpoolforswap("0x1c8d43b8d85cc0d2ca2ccd3ea04d45c60be48622", "0x065a049b5be75e4f1d29a03c6edb5acc1a4e3b93", chain_id, '0.2')
    // console.log("123",balancein, balanceout);
  };


  return (
    <>
      {isLoadings && (
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      )}
      <div className="flex flex-col items-center bg-white p-7 absolute w-full lg:w-1/2 top-[40%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col gap-1 shadow-2xl">

        <div className="p-[16px] bg-[#f9f9f9] rounded-[16px] w-[90%]">
          <div>
            <div className="font-[485] tex-sm text-[#7d7d7d] tracking-[-0.01]"> You pay </div>
              <div className="flex justify-between">
                <input
                  className="border-none bg-[#f9f9f9] text-[28px] font-[485] text-[#222222] w-[60%]"
                  type="text"
                  value={fromTokenAmount}
                  placeholder="0"
                  disabled={address ? false : true}
                  onChange={onChangeAmountInput}
                />
                <div className="flex flex-col justify-center item-center">
                  <div className="bg-white rounded-3xl flex min-w-[80px] h-[32px]" style={{border: "1px solid #e9e6e6"}}>
                    <button className="w-full h-full flex justify-center items-center pl-3 gap-3" onClick={() => {
                      // setShowModal(true);
                      console.log(FromTokenBalance, fromToken);
                      
                      setSelectModal(1);
                    }}>{FromTokenBalance?.symbol}<span>
                      <Image className="mr-2" src={"/arrow-down.png"} width={14} height={14} alt='arrow down'/>
                    </span></button>
                  </div>
                </div>
              </div>
            <div className="font-[485] text-[14px] text-[#7d7d7d] tracking-[-0.01em] text-right">Balance: {FromTokenBalance?.formatted}</div>
            <p className="text-xs ml-1.5 mt-1 text-red-500" hidden={!isExceedBalance}>
              The amount entered exceeds the available balance.
            </p>
          </div>
        </div>

        <div className="p-[16px] bg-[#f9f9f9] rounded-[16px] w-[90%] pb-9 relative" style={{border:'1px solid #e9e6e6'}}>
          <div>
            <div className="font-[485] tex-sm text-[#7d7d7d] tracking-[-0.01]"> You received </div>
              <div className="flex justify-between">
                <input
                  className="border-none bg-[#f9f9f9] text-[28px] font-[485] text-[#222222] w-[60%]"
                  type="text"
                  placeholder="0"
                  disabled
                  value={quote === 0 ? '' : quote}
                />
                <div className="flex flex-col justify-center item-center">
                  <div className="bg-white rounded-3xl flex min-w-[80px] h-[32px]" style={{border: "1px solid #e9e6e6"}}>
                    <button className="w-full h-full flex justify-center items-center pl-3 gap-3" onClick={() => {
                      setShowModal(true);
                      setSelectModal(2)
                    }}>{
                      toTokenSymbolTemp == '' ? "Select Token" : toTokenSymbolTemp
                    }<span>
                      <Image className="mr-2" src={"/arrow-down.png"} width={14} height={14} alt='arrow down'/>
                    </span></button>
                  </div>
                </div>
              </div>
          </div>
          <div className="absolute top-[-17px] left-[50%] bg-white p-1">
            <div className="w-[25px] h-[25px] flex justify-center items-center bg-[#f9f9f9]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222222" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="w-[90%]">
          <Button
            disabled={!isExceedBalance && amount != 0 && toToken && !isLoadings ? false : true}
            onClick={onClickSwapButton}
            className="!py-3 bg-[#22222212] w-[100%] text-black h-3xl"
          >
            {
              fromToken == '' ? "Select Token" : "Swap"
            }
          </Button>
        </div>
      </div>
      { isOpenSuccess && (
        <Alert>
          <AlertTitle>Success!</AlertTitle>
          <AlertDescription>
            The swap was completed successfully.
          </AlertDescription>
        </Alert>
      )}
      { isOpenError && (
        <Alert>
          <AlertTitle>Error!</AlertTitle>
          <AlertDescription>
            An issue occurred during the swap process.
          </AlertDescription>
        </Alert>
      )}


      {showModal ? (
        <>
          <div className="flex justify-center items-center overflow-x-hidden overflow-y-auto fixed inset-0 z-50 outline-none focus:outline-none">
            <div className="relative w-auto my-6 mx-auto max-w-3xl">
              <div className="border-0 rounded-3xl shadow-lg relative flex flex-col w-full bg-white outline-none focus:outline-none">
                <div className="flex items-start justify-between p-5 pb-0 rounded-t ">
                  <h3 className="text-sm font=semibold">Select a token</h3>
                  <button
                    className="bg-transparent border-0 text-black float-right"
                    onClick={() => setShowModal(false)}
                  >
                    <span className="text-black opacity-7 h-6 w-6 text-xl block py-0 rounded-full">
                      x
                    </span>
                  </button>
                </div>
                <div className="flex items-center p-5 border-b border-solid border-gray-300 ">
                    <div className="flex space-x-1">
                        <input
                            type="text"
                            className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-full focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Search..."
                        />
                        <button className="px-4 text-white bg-purple-600 rounded-full ">
                            <svg
                                xmlns="http://www.w3.org/2000/svg"
                                className="w-5 h-5"
                                fill="none"
                                viewBox="0 0 24 24"
                                stroke="currentColor"
                                strokeWidth={2}
                            >
                                <path
                                    strokeLinecap="round"
                                    strokeLinejoin="round"
                                    d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
                                />
                            </svg>
                        </button>
                    </div>
                </div>
                <div className="relative p-5 flex-auto min-h-[400px] max-h-[400px] overflow-y-scroll">
                  <h3 className="text-sm font=semibold">Popular tokens</h3>
                  {
                    tokenlists && tokenlists.map((item, id) => (
                      <div key={id} className="flex gap-3 mt-3" onClick={() => {
                        if(selectModal == 2){
                          setToToken(item.id);
                          setToTokenSymbolTemp(item.symbol);
                        }else if(selectModal == 1){
                          setFromToken(item.id);
                        }
                        setShowModal(false);
                      }}>
                        <div className="flex items-center">
                          <div className="rounded-[100px] bg-[#22222212] h-[36px] w-[36px] text-[12px] justify-center flex items-center">{item.symbol.slice(0, 3)}</div>
                        </div>
                        <div className="flex flex-col">
                          <div className="text-ellipsis">{item.name}</div>
                          <div className="font-[485] text-xs text-[#7d7d7d]">{item.symbol}</div>
                        </div>
                      </div>
                    ))
                  }
                </div>
              </div>
            </div>
          </div>
        </>
      ) : (
        <>
        </>
      )}

    </>
  );
};

export default Swap;