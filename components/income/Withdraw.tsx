import styles from "./Withdraw.module.scss";
import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { useStakingContract } from "../../hooks";
import { ethImgBackup, showSnackBar } from '../../utils';

import {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { formatCoinAmount, formatPrecisionAmount, showMessage, showPendingMessage} from "../../utils";
import { ethers } from 'ethers';
import Button from "../common/Button/Button";
import {useRouter} from "next/router";
import _ from "lodash";
import {useI18n} from "next-localization";

export default function Withdraw() {
  const router = useRouter();
  const tokenName = router ? router.query.symbol : '';
  if(!tokenName) {
    return <></>
  }
  const i18n = useI18n();
  const UpperTokenName = tokenName ? _.toUpper(tokenName as any)!="USDT" ? "n"+_.toUpper(tokenName as any):"NEST" : '';
  const tokenAddress = router ? router.query.nAddress : '';
  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [myUnclaimRewards, setMyUnclaimRewards] = useState<string>('');
  const [, forceUpdate] = useState<number>();
  let [yourCurrentStakedNest, setYourCurrentStakedNest] = useState<string>(
    ""
  );

  const contract: Contract | undefined = useStakingContract(true);
  const { account } = useWeb3React<Web3Provider>();
  const imgsrc= "/static/images/" + UpperTokenName.replace("n","") +".png";

  useEffect((): any => {
    if (contract) {
      contract.earned(tokenAddress, account).then((res: any) => {
        setMyUnclaimRewards(formatCoinAmount(res.toString()));
      })
    }
  },[contract, loading1])

  useEffect((): any => {
    if (contract) {
      contract.stakedBalanceOf(tokenAddress, account).then((res: any) => {
        setYourCurrentStakedNest(formatCoinAmount(res.toString()));
      })
    }
  },[contract, loading2])
  
  const doWithdraw = () => {
    if(loading2){
      return ;
    }
    if(!loading2) {
      setLoading2(true);
      contract?.unstake(tokenAddress, ethers.utils.parseEther(yourCurrentStakedNest))
          .then((tx: TransactionResponse) => {
            showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
            tx.wait(1).then((receipt: TransactionReceipt) => {
              setLoading2(false);
              showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
            }).catch(function (err: any) {
              showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
              setLoading2(false);
            });
          }).catch(function (err: any) {
            showSnackBar(i18n.t('The request failed'));
            setLoading2(false);
          });
    }
  }
  const doClaim = ()=>{
    if(loading1){
      return ;
    }
    setLoading1(true);
    contract?.claim(tokenAddress)
        .then((tx: TransactionResponse) => {
          showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'))
          tx.wait(1).then((receipt: TransactionReceipt)=>{
            if(receipt.status){
              forceUpdate(1);
              showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
              setLoading1(false);
            }
          }).catch(function(err: any) {
            setLoading1(false);
            showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
          });
        }).catch(function(err: any) {
            setLoading1(false);
            showSnackBar(i18n.t('The request failed'));
          });
  }

  return (
    <div className={"dataContainer"}>
      <div className={"swapDataValueContainer"}>
        <div className={styles.swapDataValue}>
          <div className={styles.cardMax}>
            <i className={styles.icon}>
              <img className={UpperTokenName == "NEST" ? styles.imgNest : ""} src={imgsrc} onError={ethImgBackup} />
            </i>
            <div className={styles.cardLabel}>{i18n.t('Your current staked token')}</div>
            <div className={styles.cardValue}>{formatPrecisionAmount(yourCurrentStakedNest, 4)} {UpperTokenName}</div>
            <Button
              disabled={!yourCurrentStakedNest || yourCurrentStakedNest == '0'}
              text={i18n.t('income')}
              onClick={doWithdraw}
              loading={loading2}
              className="button-pink"
            />
          </div>
        </div>
        <div className={styles.swapDataValue}>
          <div className={styles.cardMax}>
            <img src="/static/images/eth.svg" />
            <div className={styles.cardLabel}>{i18n.t('My unclaim rewards')}</div>
            <div className={styles.cardValue}> { formatPrecisionAmount(myUnclaimRewards, 8) } ETH</div>
            <Button
              disabled={!myUnclaimRewards || myUnclaimRewards == '0'}
              text={i18n.t('Claim')}
              onClick={doClaim}
              loading={loading1}
              className="button-pink"
            />
          </div>
        </div>
      </div>
    </div>
  );
}
