// import { ethers } from 'ethers';
// import { useContractWrite  } from 'wagmi';

// import GeneralArtifact from '../utils/abis/GeneralArtifact.json';

// const DECIMALS = 18;

// const useFromToken = (fromTokenAddress: string) => {

//   const approve = async (address: string, amount: number) => {
//     const parsedAmount = ethers.utils.parseUnits(amount.toString(), DECIMALS);
//     const {data: txn, error, isError} = useContractWrite({
//       address: fromTokenAddress,
//       abi: GeneralArtifact.abi,
//       functionName: 'approve',
//       args: [address, parsedAmount]
//     })
//     if (isError) throw new Error('From token contract has not been initialized');

//     return txn;
//   };

//   return { approve };
// };

// export default useFromToken;
