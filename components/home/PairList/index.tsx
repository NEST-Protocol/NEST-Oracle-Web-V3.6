import styles from './index.module.scss';
import { IPariItem } from '../../../services';
import {useWeb3React} from '@web3-react/core';
import PairItem from './PairItem';
import BigNumber from 'bignumber.js';
import {useEffect, useState} from 'react';
import { getAddress, getERC20Contract } from "../../../hooks";
import {useI18n} from 'next-localization';
import { showAddOracle, isAddress, showSnackBar } from '../../../utils';
import { Contract } from '@ethersproject/contracts'
import { useNTokenControllerContract } from "../../../hooks";
import cookie from 'react-cookies'


export default function PairList() {
    const { library, chainId } = useWeb3React();
    const i18n = useI18n();
    const ethToUsdt: IPariItem = {
      address: getAddress("usdt"),
      nAddress: getAddress("NestToken"),
      symbol: "USDT"
    }
    const ethToHbtc: IPariItem = {
      address: getAddress("hbtc"),
      nAddress: getAddress("nhbtc"),
      symbol: "HBTC"
    }
    const initial: IPariItem[] = [ethToUsdt, ethToHbtc]
    const [renderList, setRenderList] = useState<IPariItem[]>(cookie.load("pairList" + chainId) || [ethToUsdt]);
    const controller: Contract | undefined = useNTokenControllerContract();
    useEffect(() => {
        setRenderList(cookie.load("pairList" + chainId) || initial);
    },[chainId])
    const acallback = (addr) => {
        if(!isAddress(addr)){
            showAddOracle(i18n.t('add oracle'), i18n.t('confirm'), i18n.t('Please enter the correct contract address'), true, i18n.t('Enter a vaild token contract address'), acallback);
            return;
        }
        let list = cookie.load("pairList" + chainId) || initial;
        let flag = true;
        list.map((i) => {
            if(i.nAddress === addr || i.address === addr) {
                flag = false;
            }
        });
        if(!flag) {
            showSnackBar(i18n.t('Token already exists'));
            return;
        };
        return controller?.getNTokenAddress(addr).then(response => {
            if(!response || new BigNumber(response).isZero()){
                showAddOracle(i18n.t('add oracle'), i18n.t('confirm'), i18n.t('Please enter the correct contract address'), true, i18n.t('Enter a vaild token contract address'), acallback)
            } else {
                let json: IPariItem  = {address: addr, nAddress: response, symbol: "" }
                let erc20 = getERC20Contract(addr, library);
                erc20?.symbol().then(response => {
                    json.symbol = response;
                    list.push(json);
                    setRenderList(list);
                    cookie.save("pairList" + chainId, JSON.stringify(list))
                })
            }
        }).catch(error => {
            showAddOracle(i18n.t('add oracle'), i18n.t('confirm'), i18n.t('Please enter the correct contract address'), true, i18n.t('Enter a vaild token contract address'), acallback)
        });
      };

    const onClick = () => {
        showAddOracle(i18n.t('add oracle'), i18n.t('confirm'), i18n.t('Please enter the correct contract address'), false, i18n.t('Enter a vaild token contract address'), acallback);
    };

    return (
    <div className={styles.container}>
        <div>
        {
            renderList.map((item: IPariItem) => {
                return <PairItem key={item.nAddress} data={item}/>
            })
        }
        </div>
        <div onClick={onClick} className={`${styles.addOracle} center`}>
            <span >+</span>
        </div>
    </div>);
}
