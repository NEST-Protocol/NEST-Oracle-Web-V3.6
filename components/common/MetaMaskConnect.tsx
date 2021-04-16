import styles from './MetaMaskConnect.module.scss';
import {useWeb3React} from '@web3-react/core';
import {Web3Provider} from '@ethersproject/providers';
import {useCallback, useEffect} from 'react';
import {InjectedConnector} from '@web3-react/injected-connector';
import {shortenAddress, showMessage, usePrevious} from '../../utils';
import {useI18n} from 'next-localization';
import {ChainIds} from '../../constants/enums';
import {useRouter} from 'next/router';
import Web3 from "web3";

//const injected = new InjectedConnector({ supportedChainIds: [ChainIds.mainnet/*main net*/, ChainIds.ropsten /*ropsten*/, ChainIds.kovan, ChainIds.rinkeby /*kovan*/] });
const injected = new InjectedConnector({ supportedChainIds: [ChainIds.mainnet/*main net*/, ChainIds.rinkeby /*rinkeby*/] });

export default function MetaMaskConnect() {
    const i18n = useI18n();
    const context = useWeb3React<Web3Provider>();
    const router = useRouter();
    const { account,activate,chainId } = context;
    useEffect(() => {
        if (typeof window !== "undefined") {
            if (window?.ethereum) {
                const web3 = new Web3(window.ethereum);
                web3.eth.getAccounts().then(res=>{
                    if(res.length==0){
                        showMessage('error', i18n.t('No wallet connected'), i18n.t('Please connect to an Ethereum wallet first'));
                    }else{
                        activate(injected)
                    }
                });
            }
        }
    }, [account, activate]);

    // force to come back to homepage when the chain changes
    const prevChainId = usePrevious(chainId);
    useEffect(() => {
        if(prevChainId && chainId){
            router.replace("/")
        }
    }, [chainId]);

    return <>
        {
            !account && <UnConnected/>
        }
        {
            account && <Connected/>
        }
    </>;
}

function UnConnected() {
    const context = useWeb3React<Web3Provider>()
    const i18n = useI18n();
    const { activate } = context

    const onClick = useCallback(()=>{
        activate(injected)
    }, [activate])

    return <div className={"crossCenter"} onClick={onClick}>
        <div className={`${styles.unactive} bodyBold`}>
            {
                i18n.t('Connect MetaMask')
            }
        </div>
        <img className={styles.metamaskIcon} src="/static/images/metamask_unactive.png" />
    </div>
};

function Connected() {
    const context = useWeb3React<Web3Provider>()
    const { account } = context
    return <div className={"crossCenter"}>
        <div className={`${styles.address} bodyBold`}>
            {
                account && shortenAddress(account)
            }
        </div>
        <img className={styles.metamaskIcon} src="/static/images/metamask.png" />
    </div>
};