// "use client"
// import React from 'react';
// import { ethers } from 'ethers';
// import { useAccount, useBalance  } from 'wagmi';

// import useSwap from '../../hooks/useSwap';
// import { Input } from '@/components/ui/input';
// import { Button } from '@/components/ui/button';
// import { Alert, AlertDescription, AlertTitle } from "@/components/ui/alert"

// interface TokenType {
//   name: string;
//   symbol: string;
//   balance: string;
//   address: string;
//   logo?: string;
// }

// const Swap = () => {
//   const [amount, setAmount] = React.useState(0);
//   const [quote, setQuote] = React.useState(0);
//   const [isLoading, setIsLoading] = React.useState(false);
//   const [isExceedBalance, setIsExceedBalance] = React.useState(false);
//   const [isInvalidFromToken, setIsInvalidFromToken] = React.useState(false);
//   const [isInvalidToToken, setIsInvalidToToken] = React.useState(false);
//   const [fromToken, setFromToken] = React.useState('0xB4FBF271143F4FBf7B91A5ded31805e42b2208d6');
//   const [toToken, setToToken] = React.useState('0x1f9840a85d5aF5bf1D1762F925BDADdC4201F984');
//   const [fromTokenAmount, setFromTokenAmount] = React.useState('');
//   const [isOpenSuccess, setIsOpenSuccess] = React.useState(false);
//   const [isOpenError, setIsOpenError] = React.useState(false);

//   const { swap, getQuote } = useSwap(fromToken, toToken);
//   const { address } = useAccount();
//   const { data: FromTokenBalance } = useBalance({
//     address: address,
//     token: fromToken as `0x${string}`,
//     watch: true
//   });
//   const { data: ToTokenBalance } = useBalance({
//     address: address,
//     token: toToken as `0x${string}`,
//     watch: true
//   });

//   const onChangeAmountInput = async (event: React.ChangeEvent<HTMLInputElement>) => {
//     const amountIn = parseFloat(event.target.value || '0');
//     setFromTokenAmount(event.target.value || '');
//     if (amountIn > parseFloat(FromTokenBalance?.formatted || '0')) {
//       setIsExceedBalance(true);
//     } else {
//       setIsExceedBalance(false);
//     }

//     setAmount(amountIn);
//     const quote = await getQuote(amountIn);
//     setQuote(quote);
//   };

//   const onClickSwapButton = async () => {

//     try {
//       setIsLoading(true);
//       const txn = await swap(amount);
//       await txn.wait();
//       setIsLoading(false);
//       setIsOpenSuccess(true);
//     } catch (e) {
//       setIsOpenError(true);
//     }
//   };

//   const onChangeFromToken = (value: any) => {
//     if (ethers.utils.isAddress(value)) {
//       setIsInvalidFromToken(false);
//       setFromToken(value);
//     } else {
//       setIsInvalidFromToken(true);
//     }

//     setFromTokenAmount('');
//     setIsExceedBalance(false);
//   };

//   const onChangeToToken = (value: any) => {
//     if (ethers.utils.isAddress(value)) {
//       setIsInvalidToToken(false);
//       setToToken(value);
//     } else {
//       setIsInvalidToToken(true);
//     }
//   };

//   const onCloseSnack = (event?: React.SyntheticEvent | Event, reason?: string) => {
//     if (reason === 'clickaway') {
//       return;
//     }

//     setIsOpenSuccess(false);
//     setIsOpenError(false);
//   };

//   return (
//     <>
//       {isLoading && (
//         <div class="lds-roller"><div></div><div></div><div></div><div></div><div></div><div></div><div></div><div></div></div>
//       )}
//       <div className="bg-white p-7 absolute w-full lg:w-1/2 top-[60%] left-1/2 transform -translate-x-1/2 -translate-y-1/2 rounded-lg flex flex-col gap-7 shadow-2xl">
//         <div className="p-7 flex flex-col gap-7">
//           <p> From Token </p>
//           <div>
//             <div className="flex">
//               <Input
//                 className="flex-1"
//                 type="text"
//                 value={fromToken}
//                 placeholder="From Token Address"
//                 disabled={address ? false : true}
//                 onChange={(event: HTMLInputElement) => onChangeFromToken(event?.target.value)}
//               />
//               <div className="bg-gray-200 rounded-r-lg flex">
//                 <Button className="text-xs leading-relaxed">{FromTokenBalance?.symbol}</Button>
//               </div>
//             </div>
//             <p className="text-xs ml-1.5 mt-1 text-red-500" hidden={!isInvalidFromToken}>
//               From Token is Invalid.
//             </p>
//           </div>

//           <div>
//             <div className="flex">
//               <Input
//                 className="flex-1"
//                 type="text"
//                 value={fromTokenAmount}
//                 placeholder="Amount in"
//                 disabled={address ? false : true}
//                 onChange={onChangeAmountInput}
//               />
//             </div>
//             <p className="text-xs ml-1.5 mt-1">Balance: {FromTokenBalance?.formatted}</p>
//             <p className="text-xs ml-1.5 mt-1 text-red-500" hidden={!isExceedBalance}>
//               The amount entered exceeds the available balance.
//             </p>
//           </div>
//         </div>

//         <div className="p-7 flex flex-col gap-7">
//           <p> To Token </p>
//           <div>
//             <div className="flex">
//               <Input
//                 className="flex-1"
//                 type="text"
//                 value={toToken}
//                 placeholder="To Token Address"
//                 disabled={address ? false : true}
//                 onChange={(event: HTMLInputElement) => onChangeToToken(event?.target.value)}
//               />
//               <div className="bg-gray-200 rounded-r-lg flex">
//                 <Button className="text-xs leading-relaxed">{ToTokenBalance?.symbol}</Button>
//               </div>
//             </div>
//             <p className="text-xs ml-1.5 mt-1 text-red-500" hidden={!isInvalidToToken}>
//               To Token is Invalid.
//             </p>
//           </div>

//           <div>
//             <div className="flex">
//               <Input
//                 className="flex-1"
//                 type="text"
//                 placeholder="Amount out"
//                 disabled
//                 value={quote === 0 ? '' : quote}
//               />
//             </div>
//             <p className="text-xs ml-1.5 mt-1">Balance: {ToTokenBalance?.formatted}</p>
//           </div>
//         </div>

//         <Button
//           disabled={address && !isLoading ? false : true}
//           onClick={onClickSwapButton}
//           variant="outlined"
//           size="large"
//           className="!py-3"
//         >
//           Swap
//         </Button>
//       </div>
//       { isOpenSuccess && (
//         <Alert>
//           <AlertTitle>Success!</AlertTitle>
//           <AlertDescription>
//             The swap was completed successfully.
//           </AlertDescription>
//         </Alert>
//       )}
//       { isOpenError && (
//         <Alert>
//           <AlertTitle>Error!</AlertTitle>
//           <AlertDescription>
//             An issue occurred during the swap process.
//           </AlertDescription>
//         </Alert>
//       )}

//     </>
//   );
// };

// export default Swap;

// // export default function Swap(){
// //   return (
// //     <>
    
// //     </>
// //   )
// // }

export default function swap() {
  return (
    <>
    </>
  )
}