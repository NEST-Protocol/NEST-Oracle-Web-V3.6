import {useMemo} from 'react';
import {useWeb3React} from "@web3-react/core";
import { Contract } from '@ethersproject/contracts'
import Address from "../constants/Contracts.json";
import {ChainIds} from "../constants/enums";
import { abi } from "../abi/erc20.json";
import { abi_nest_staking } from "../abi/new_abi.json";
import { nest_redeeming_abi } from "../abi/INestRedeeming.json";
import { nest_ledger_abi } from "../abi/INestLedger.json";
import { nToken_abi } from "../abi/INToken.json";
import { nest_pricing_abi } from "../abi/INestPriceFacade.json";
import { nest_vote_abi } from "../abi/INestVote.json";
import { nToken_controller_abi } from "../abi/INTokenController.json";
import { isAddress } from "../utils";

export function getAddress(name: string): string | undefined {
    const { chainId } = useWeb3React()
    return useMemo(
        () => getContractAddress(name, chainId),
        [chainId]
    )
}

function getContractAddress(name: string, chainId?: number): string | undefined {
    const chain = (chainId == ChainIds?.mainnet) ? 'mainnet' : 'rinkeby'
    return Address[chain][name]
}

function useContract(name: string, abi: any, withSigner = true): Contract | undefined {
    const { library, account, chainId } = useWeb3React()
    const address = isAddress(name) ? name : getContractAddress(name, chainId)
    return useMemo(
        () =>
            !!address && !!abi && !!library
                ? new Contract(address, abi, withSigner ? library.getSigner(account).connectUnchecked() : library)
                : undefined,
        [address, abi, withSigner, library, account]
    )
}

export function getERC20Contract(addr: any, library: any): Contract | undefined {
    return new Contract(addr, abi, library);
}

export function useStakingContract(withSigner = true): Contract | undefined {
    return useContract("NestStakingAddress", abi_nest_staking, withSigner)
}

export function useRedeeming(withSigner = true): Contract | undefined {
    return useContract("NestRedeeming", nest_redeeming_abi, withSigner)
}

export function usePricingContract(withSigner = true): Contract | undefined {
    return useContract("NestPriceFacade", nest_pricing_abi, withSigner)
}

export function useNTokenContract(addr: any, withSigner = true): Contract | undefined {
    return useContract(addr, nToken_abi, withSigner)
}

export function useLedgerContract(withSigner = true): Contract | undefined {
    return useContract("NestLedger", nest_ledger_abi, withSigner)
}

export function useVoteContract(withSigner = true): Contract | undefined {
    return useContract("NestVote", nest_vote_abi, withSigner)
}

export function useNTokenControllerContract(withSigner = true): Contract | undefined {
    return useContract("NTokenController", nToken_controller_abi, withSigner)
}
