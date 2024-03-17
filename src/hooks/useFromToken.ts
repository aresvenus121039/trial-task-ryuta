import { ethers, VoidSigner } from "ethers";
import { useChainId, useAccount } from "wagmi";
import { DEPRECATED_RPC_PROVIDERS } from "@/lib/providers";
import ERC20_abi from '@/utils/abis/ERC20_abi.json';
import { Token } from "@uniswap/sdk-core";

const useFromToken = (fromTokenAddress: string) => {
  const chainId = useChainId();
  const { address } = useAccount();
  let provider = DEPRECATED_RPC_PROVIDERS[chainId];
  let signer = new VoidSigner(address as `0x${string}`, provider);

  const contractIn = new ethers.Contract(fromTokenAddress, ERC20_abi, provider);

  const approve = async (tokenAddress: string, amount: number) => {
    if (!tokenAddress) throw new Error('From token contract has not been initialized');

    const getTokenAndBalance = async function (contract: ethers.Contract) {
      var [dec, symbol, name, balance] = await Promise.all(
        [
          contract.decimals(),
          contract.symbol(),
          contract.name(),
          contract.balanceOf(address)
        ]);
  
      return [new Token(chainId, contract.address, dec, symbol, name), balance];
    }

    const [tokenIn, balanceTokenIn] = await getTokenAndBalance(contractIn);

    const parsedAmount = ethers.utils.parseUnits(amount.toString(), tokenIn.decimals);

    const txn = contractIn.approve(address, parsedAmount);
    return txn;
  };

  return { approve };
}

export default useFromToken;