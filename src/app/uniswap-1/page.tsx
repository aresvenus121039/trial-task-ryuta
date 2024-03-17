"use client"
import React from 'react';
import { useAccount, useBalance, useChainId  } from 'wagmi';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
import { initswap, approveForSwap, makeswap, getBalance } from '@/utils/swapquote';
import Image from 'next/image';
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import gql from 'graphql-tag';
import { useLazyQuery, useQuery } from '@apollo/client';
import { redirect } from 'next/navigation';
import { nativeOnChain } from '@/lib/tokens'

interface RouteType {
  quoteGasAdjusted? : any;
  estimatedGasUsedQuoteToken? : any;
  estimatedGasUsedUSD? : any;
  estimatedGasUsed? : any;
  gasPriceWei? : any;
}
interface TokenType {
  address: string;
  name: string;
  symbol: string;
  logo?: string;
  id?: string;
  chainId: number;
}

const TOKENLISTS_QUERY = gql`
    query GET($amount: Int!) {
      tokens(orderBy: volumeUSD, orderDirection: desc, first: $amount) {
        decimals
        name
        symbol
        id
      }
    }
`
const FILTER_QUERY = gql`
        query GET($name: String!) {
          tokens(orderBy: volumeUSD, orderDirection: desc, first: 10, where: {symbol: $name}) {
            decimals
            name
            symbol
            id
          }
        }
    `

const Swap = () => {

  const [amount, setAmount] = React.useState(0);
  const [quote, setQuote] = React.useState(0);
  const [isLoadings, setIsLoading] = React.useState(false);
  const [isExceedBalance, setIsExceedBalance] = React.useState(false);
  const [fromToken, setFromToken] = React.useState<string>('');
  const [tokenLists, setTokenLists] = React.useState<TokenType[]>([]);
  const [allTokenLists, setAllTokenList] = React.useState<TokenType[]>([]);
  const [toToken, setToToken] = React.useState('');
  const [fromBalance, setFromBalance] = React.useState(0);
  const [toBalance, setToBalance] = React.useState(0);
  const [fromTokenAmount, setFromTokenAmount] = React.useState('');
  const [isOpenSuccess, setIsOpenSuccess] = React.useState(false);
  const [isOpenError, setIsOpenError] = React.useState(false);

  const [showModal, setShowModal] = React.useState<boolean>(false)
  const [selectModal, setSelectModal] = React.useState<number>(0)
  const [toTokenSymbolTemp, setToTokenSymbolTemp] = React.useState<string>('')
  const [fromTokenSymbolTemp, setFromTokenSymbolTemp] = React.useState<string>('')
  const [nativeToken, setNativeToken] = React.useState<any>({})

  const [fromContract, setFromContract] = React.useState()
  const [toContract, setToContract] = React.useState()
  const [signerr, setSignerr] = React.useState()
  const [providerr, setProviderr] = React.useState()
  const [provide, setProvide] = React.useState()
  const [routee, setRoutee] = React.useState<RouteType>({})
  const [searchName, setSearchName] = React.useState<string>('')
  const [filterName, setFilterName] = React.useState<string>('')
  
  const [step, setStep] = React.useState(0)

  const { address, isConnected, isDisconnected } = useAccount();

  const { data: FromTokenBalance } = useBalance({
    address: address,
    // token: '0xfFf9976782d46CC05630D1f6eBAb18b2324d6B14',
    watch: true
  });
  const { data: ToTokenBalance } = useBalance({
    address: address,
    // token: toToken as `0x${string}`,
    watch: true
  });

  const chain_id = useChainId()

  // const {
  //   loading,
  //   data: data
  // } = useQuery(TOKENLISTS_QUERY, {
  //   variables: {
  //     amount: 10
  //   }
  // })
  // const [
  //   filterAction,
  //   { data : filterData, loading: filterLoading }
  // ] = useLazyQuery(FILTER_QUERY,{
  //   variables: {
  //     name: filterName
  //   }
  // })
  // React.useEffect(() => {
  //   setIsLoading(filterLoading)
  //   if(!filterLoading) setTokenLists(filterData?.tokens);    
  // },[filterLoading])

  // React.useEffect(() => {
    // setIsLoading(loading)
    // const initProvider = async () => {
    //   const provider = await connector?.getProvider();
    //   setProvide(provider);
    // }
    // if(!loading) setTokenLists(data?.tokens)
    // initProvider()
  // },[loading])
  React.useEffect(() => {
    setFromToken('')
    setToToken('')
    setFromTokenSymbolTemp('')
    setToTokenSymbolTemp('')
    setSearchName('')

    const data: any = nativeOnChain(chain_id)
    setNativeToken(data.wrapped);

    const init = async () => {
      setIsLoading(true);
      const requestOptions = {
        method: 'GET',
        headers: { 'Content-Type': 'application/json' }
      };
      const response = await fetch('/api/tokenlists', requestOptions);
      const data = await response.json()
      
      setIsLoading(false);
      setAllTokenList(data.data.tokens)
      setTokenLists(data.data.tokens.filter((item : TokenType) => item.chainId == chain_id))
    }
    init()
    
  },[chain_id])

  const walletAuth = React.useMemo(() => {
    if((!isConnected || isDisconnected) && typeof window !== 'undefined'){
      redirect('/error/walletconnect')
    }
  },[isConnected, isDisconnected])
    
  const onChangeAmountInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
    if(!fromToken || !toToken){
      alert("First Choose 'From Token' and 'To Token'");
      return;
    }
    const amountIn = parseFloat(event.target.value || '0');
    setAmount(amountIn);
    setFromTokenAmount(event.target.value || '');
    if (amountIn > fromBalance) {
      setIsExceedBalance(true);
    } else {
      setIsExceedBalance(false);
    }
  };

  const onClickSwapButton = async () => {
    if(step == 0){
      // await initswap(fromToken, toToken,provide, address, chain_id, amount)
      const [
        contractIn,
        contractOut,
        signer,
        route,
        provider,
        balanceTokenIn,
        balanceTokenOut
      ] = await initswap(fromToken, toToken,provide, address, chain_id, amount)
      setFromContract(contractIn)
      setToContract(contractOut)
      setSignerr(signer)
      setRoutee(route)
      setFromBalance(balanceTokenIn)
      setToBalance(balanceTokenOut)
      setProviderr(provider)
      setStep(1)
    }else if(step == 1){
      setIsLoading(true)
      const [
        signer,
        contractIn,
        contractOut
      ] = await approveForSwap(fromContract, toContract, address, chain_id, amount, providerr, signerr);
      setIsLoading(false)
      setSignerr(signer)
      setFromContract(contractIn)
      setToContract(contractOut)
      setStep(2)
    }else if(step == 2){
      setIsLoading(true)
      await makeswap(address,routee, signerr, fromContract, toContract, chain_id)
      setIsLoading(false)
      setIsOpenSuccess(true)
    }
  };

  const onSearch = () => {
    // filterAction()
    setFilterName(searchName)

    const data = allTokenLists.filter((item: TokenType) => searchName != '' ? item.symbol == searchName && item.chainId == chain_id : item.chainId == chain_id);
    setTokenLists(data);
  }

  return (
    <>
      {isLoadings && (
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      )}
      <div className="flex flex-col items-center bg-white p-7 absolute w-full lg:w-1/2 top-[55%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col gap-1 shadow-2xl">

        <div className="p-[16px] bg-[#f9f9f9] rounded-[16px] w-[90%]">
          <div>
            <div className="font-[485] tex-sm text-[#7d7d7d] tracking-[-0.01]"> You pay </div>
              <div className="flex justify-between">
                <input
                  className="border-none bg-[#f9f9f9] text-[28px] font-[485] text-[#222222] w-[60%]"
                  type="text"
                  value={fromTokenAmount}
                  placeholder="0"
                  disabled={fromToken ? false : true}
                  onChange={onChangeAmountInput}
                />
                <div className="flex flex-col justify-center item-center">
                  <div className="bg-white rounded-3xl flex min-w-[80px] h-[32px]" style={{border: "1px solid #e9e6e6"}}>
                    <button className="w-full h-full flex justify-center items-center pl-3 gap-3" onClick={() => {
                      setTokenLists(allTokenLists.filter((item: TokenType) => searchName != '' ? item.symbol == searchName && item.chainId == chain_id : item.chainId == chain_id));
                      setShowModal(true)
                      setSearchName('')
                      setSelectModal(1)
                    }}><div className="text-ellipsis text-nowrap overflow-hidden">{fromTokenSymbolTemp == '' ? "Select From-Token" : fromTokenSymbolTemp}</div><span>
                      <Image className="mr-2" src={"/arrow-down.png"} width={14} height={14} alt='arrow down'/>
                    </span></button>
                  </div>
                </div>
              </div>
            <div className="font-[485] text-[14px] text-[#7d7d7d] tracking-[-0.01em] text-right">Balance: {fromBalance}</div>
            <p className="text-xs ml-1.5 mt-1 text-red-500" hidden={!isExceedBalance}>
              The amount entered exceeds the available balance.
            </p>
          </div>
        </div>

        <div className="p-[16px] bg-[#f9f9f9] rounded-[16px] w-[90%] relative" style={{border:'1px solid #e9e6e6'}}>
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
                      setTokenLists(allTokenLists.filter((item: TokenType) => searchName != '' ? item.symbol == searchName && item.chainId == chain_id : item.chainId == chain_id));
                      setShowModal(true)
                      setSearchName('')
                      setSelectModal(2)
                    }}><div className="text-ellipsis text-nowrap overflow-hidden">{
                      toTokenSymbolTemp == '' ? "Select To-Token" : toTokenSymbolTemp
                    }</div><span>
                      <Image className="mr-2" src={"/arrow-down.png"} width={14} height={14} alt='arrow down'/>
                    </span></button>
                  </div>
                </div>
              </div>
              <div className="font-[485] text-[14px] text-[#7d7d7d] tracking-[-0.01em] text-right">Balance: {toBalance}</div>
          </div>
          <div className="absolute top-[-17px] left-[50%] bg-white p-1">
            <div className="w-[25px] h-[25px] flex justify-center items-center bg-[#f9f9f9]">
              <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="#222222" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><polyline points="19 12 12 19 5 12"></polyline></svg>
            </div>
          </div>
        </div>

        <div className="w-[90%]">
          <Button
            // disabled={!isExceedBalance && amount != 0 && fromToken && toToken && !isLoadings ? false : true}
            onClick={onClickSwapButton}
            className="!py-3 bg-[#22222212] w-[100%] text-black h-3xl"
          >
            {
              fromToken == '' ? "Select Token" : step == 0 ? "Init" : step == 1 ? "Aprove" : "Swap"
            }
          </Button>
        </div>
        <div className="w-[90%]">
          <Accordion type="single" collapsible>
            <AccordionItem value="item-1">
              <AccordionTrigger>Information for swap</AccordionTrigger>
              <AccordionContent>
                <div>
                  <p>Gas Adjusted Quote: {routee && routee?.quoteGasAdjusted?.toFixed()}</p>
                  <p>Gas Used Quote Token: {routee && routee?.estimatedGasUsedQuoteToken?.toFixed()}</p>
                  <p>Gas Used USD: {routee && routee?.estimatedGasUsedUSD?.toFixed()}</p>
                  <p>Gas Used: {routee && routee?.estimatedGasUsed?.toString()}</p>
                  <p>Gas Price Wei: {routee && routee?.gasPriceWei}</p>
                </div>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
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
                    onClick={() => {
                      setShowModal(false)
                      setSearchName('')
                      setFilterName('')
                      if(selectModal == 1){
                        setFromToken('');
                        setFromTokenSymbolTemp('');
                        setFromBalance(0)
                      } else {
                        setToToken('');
                        setToTokenSymbolTemp('');
                        setToBalance(0)
                      }
                    }}
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
                            value={searchName}
                            className="block w-full px-4 py-2 text-purple-700 bg-white border rounded-full focus:border-purple-400 focus:ring-purple-300 focus:outline-none focus:ring focus:ring-opacity-40"
                            placeholder="Search..."
                            onChange={e => setSearchName(e.target.value)}
                        />
                        <button className="px-4 text-white bg-purple-600 rounded-full " onClick={() => onSearch()}>
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
                    <div key={-1} className="flex gap-3 mt-3 cursor-pointer" onClick={async () => {
                      const balance = await getBalance(provide, nativeToken.address, chain_id)                      
                      if(selectModal == 2){
                        setToToken(nativeToken.address);
                        setToTokenSymbolTemp(nativeToken.symbol);
                        setToBalance(parseFloat(balance))
                      }else if(selectModal == 1){
                        setFromToken(nativeToken.address);
                        setFromTokenSymbolTemp(nativeToken.symbol)
                        setFromBalance(parseFloat(balance))
                      }
                      setShowModal(false);
                    }}>
                      <div className="flex items-center">
                        <div className="rounded-[100px] bg-[#5fd0f3] h-[36px] w-[36px] text-[12px] justify-center flex items-center">{'ETH'}</div>
                      </div>
                      <div className="flex flex-col">
                        <div className="text-ellipsis">{nativeToken.symbol}</div>
                        <div className="font-[485] text-xs text-[#7d7d7d]">{nativeToken.symbol}</div>
                      </div>
                    </div>
                  {
                    tokenLists && tokenLists.map((item: TokenType, id: number) => (
                      <div key={id} className="flex gap-3 mt-3 cursor-pointer" onClick={async () => {
                        const balance = await getBalance(provide, item.address, chain_id)
                        if(selectModal == 2){
                          setToToken(item.address);
                          setToTokenSymbolTemp(item.symbol);
                          setToBalance(parseFloat(balance))
                        }else if(selectModal == 1){
                          setFromToken(item.address);
                          setFromTokenSymbolTemp(item.symbol)
                          setFromBalance(parseFloat(balance))
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