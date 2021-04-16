import { Contract } from '@ethersproject/contracts'
import { useMemo } from 'react'
import {useWeb3React} from "@web3-react/core";

// returns null on errors
function useContract(address: string | undefined, ABI: any, withSigner = false): Contract | null {
  const { library, account } = useWeb3React()

  return useMemo(() => {
    if (!address || !ABI || !library) return null
    try {
      return new Contract(address, ABI, withSigner ? library.getSigner(account).connectUnchecked() : library)
    } catch (error) {
      console.error('Failed to get contract', error)
      return null
    }
  }, [address, ABI, library, account])
}
