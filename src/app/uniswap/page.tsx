"use client"
import React from 'react';
import { ethers } from 'ethers';
import { useAccount, useBalance, useChainId, useToken  } from 'wagmi';
import { schema } from '@uniswap/token-lists';

// import useSwap from '../../hooks/useSwap';
import { Input } from '@/components/ui/input';
import { Button } from '@/components/ui/button';
import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert";
// import { quotes } from "@/utils/quote";
import {Alchemy, Network} from "alchemy-sdk"

interface TokenType {
  name: string;
  symbol: string;
  balance: string;
  address: string;
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
  const [isLoading, setIsLoading] = React.useState(false);
  const [isExceedBalance, setIsExceedBalance] = React.useState(false);
  const [isInvalidFromToken, setIsInvalidFromToken] = React.useState(false);
  const [isInvalidToToken, setIsInvalidToToken] = React.useState(false);
  const [fromToken, setFromToken] = React.useState('');
  const [toToken, setToToken] = React.useState('');
  const [fromTokenAmount, setFromTokenAmount] = React.useState('');
  const [isOpenSuccess, setIsOpenSuccess] = React.useState(false);
  const [isOpenError, setIsOpenError] = React.useState(false);

  const [tokens, setTokenDetails] = React.useState<TokenType[]>([])
  const [fromBalance, setFromBalance] = React.useState<string>('')

  const fetchTokens = React.useCallback(async (walletAddress: string) => {
    try {
      const balances = await alchemy.core.getTokenBalances(walletAddress);
      const tokenDetails: TokenType[] = await Promise.all(
        balances.tokenBalances
          .filter((token) => token.tokenBalance !== "0")
          .map(async (token) => {
            const metadata = await alchemy.core.getTokenMetadata(
              token.contractAddress,
            );

            return {
              name: metadata.name ?? "Unknown Name",
              symbol: metadata.symbol ?? "Unknown Symbol",
              balance:
                metadata.decimals !== null
                  ? (
                      Number(token.tokenBalance) /
                      Math.pow(10, metadata.decimals)
                    ).toFixed(2)
                  : "0.00",
              address: token.contractAddress,
            };
          }),
      );

      console.log("tokenDetails->",tokenDetails);
      
      
      setTokenDetails(tokenDetails);
    } catch (error) {
      console.error("Error fetching Tokens Balances:", error);
    }
  }, []);

  // const { swap, getQuote } = useSwap(fromToken, toToken);
  const { address } = useAccount();
  const { data: FromTokenBalance } = useBalance({
    address: address,
    token: fromToken as `0x${string}`,
    watch: true
  });
  const { data: ToTokenBalance } = useBalance({
    address: address,
    token: toToken as `0x${string}`,
    watch: true
  });
  const chain_id = useChainId();

  // React.useEffect(() => {
  //   fetchTokens(address);   
  // },[])

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

    // try {
    //   setIsLoading(true);
    //   const txn = await swap(amount);
    //   await txn.wait();
    //   setIsLoading(false);
    //   setIsOpenSuccess(true);
    // } catch (e) {
    //   setIsOpenError(true);
    // }

    // const tokenA = new Token(chain_id, fromToken, 18);
    // const tokenB = new Token(chain_id, toToken, 18);
    
    // const outAmount = await quotes(fromTokenAmount, 18, 18, tokenA, tokenB);

    // console.log(outAmount);
    
  };


  return (
    <>
      {isLoading && (
        <div className="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
      )}
      <div className="flex flex-col items-center bg-white p-7 absolute w-full lg:w-1/2 top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col gap-7 shadow-2xl">

        <div className="p-[16px] bg-[#f9f9f9] rounded-[16px] w-[90%]" style={{border:'1px solid rgb(249, 249, 249)'}}>
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
                <div className="bg-gray-200 rounded-r-lg flex">
                  <select onChange={(e) => {
                    setFromToken(e.target.value);
                    if(e.target.value == "0")return;
                    setFromBalance(tokens.filter((item) => item.address == e.target.value)[0].balance);
                  }}>
                    <option selected value="0">Select...</option>
                    {
                      tokens && tokens.map((item : TokenType, id: number) => (
                        <option key={`from${id}`} value={item.address}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            <div className="font-[485] text-[14px] text-[#7d7d7d] tracking-[-0.01em] text-right">Balance: {fromBalance}</div>
            <p className="text-xs ml-1.5 mt-1 text-red-500" hidden={!isExceedBalance}>
              The amount entered exceeds the available balance.
            </p>
          </div>
        </div>

        <div className="p-[16px] bg-[#f9f9f9] rounded-[16px] w-[90%]" style={{border:'1px solid rgb(249, 249, 249)'}}>
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
                <div className="bg-gray-200 rounded-r-lg flex">
                  <select onChange={(e) => setToToken(e.target.value)}>
                    <option selected value="0">Select...</option>
                    {
                      tokens && tokens.map((item : TokenType, id: number) => (
                        <option key={`to${id}`} value={item.address}>{item.name}</option>
                      ))
                    }
                  </select>
                </div>
              </div>
            <p className="text-xs ml-1.5 mt-1">Balance: {ToTokenBalance?.formatted}</p>
          </div>
        </div>

        <Button
          disabled={address && !isLoading ? false : true}
          onClick={onClickSwapButton}
          className="!py-3"
        >
          Swap
        </Button>
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

    </>
  );
};

export default Swap;

// export default function Swap(){
//   return (
//     <>
    
//     </>
//   )
// }