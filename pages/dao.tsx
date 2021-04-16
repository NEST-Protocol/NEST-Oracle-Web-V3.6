import styles from "../styles/dao.module.scss";
import PageNav from "../components/common/PageNav";
import { useEffect, useState, useMemo} from "react";
import {useWeb3React} from "@web3-react/core";
import {TransactionReceipt, TransactionResponse} from "@ethersproject/providers";
import {useRouter} from "next/router";
import _ from "lodash";
import NumberInput from "../components/common/Input/InputNumber";
import Button from "../components/common/Button/Button";
import { ethers} from "ethers";
import {Contract} from "@ethersproject/contracts";
import {useRedeeming, usePricingContract, useNTokenContract, useVoteContract, useLedgerContract} from "../hooks";
import {formatPrecisionAmount, formatCoinAmount, showMessage, showPendingMessage, showSnackBar} from "../utils";
import {MaxUint256} from "@ethersproject/constants";
import {useI18n} from "next-localization";
import CheckBoxCmm from "../components/common/CheckBoxCmm/CheckBoxCmm";
import cookie from 'react-cookies'
import { getAddress } from "../hooks";

export default function Home() {
    const { account } = useWeb3React();
    const router = useRouter();
    const tokenName = router ? router.query.symbol : '';
    if(!tokenName) {
      return <></>
    }
    const UpperTokenName = tokenName ? _.toUpper(tokenName as any)!="USDT" ? "n"+_.toUpper(tokenName as any):"NEST" : '';
    const tokenAddress = router ? router.query.nAddress : '';
    const i18n = useI18n();
    let [currAllowance , setCurrAllowance] = useState<string>('');
    const [loading, setLoading] = useState<boolean>(false);
    const [amount, setAmount] = useState<string>("");
    const [, forceUpdate] = useState<number>();
    const [hasCheck, setHasCheck] = useState<String>("none");
    const redeemAddress = getAddress('NestRedeeming');
    const ledgerAddress = getAddress('NestLedger');
    const blackHoleAddr = getAddress('blackHole');
    const [totalRewards, setTotalRewards] = useState(0);
    const [quota, setQuota] = useState(0);

    const [currentOraclePriceValue, setCurrentOraclePrice] = useState(0);
    const [oracleFee, setOracleFee] = useState(0.01);
    const [daoLockAmount, setDaoLockAmount] = useState<string>("0");
    const [burnAmount, setBurnAmount] = useState<string>("0");
    const [nestCirculation, setNestCirculation] = useState<string>("0");
    const [balance, setBalance] = useState("0");

    const miniValue = useMemo(() => {
        return(Math.min(quota, totalRewards * Number(currentOraclePriceValue)));
    }, [quota, totalRewards, currentOraclePriceValue]);
    
    const contractReeming: Contract | undefined = useRedeeming();
    const contractPricing: Contract | undefined = usePricingContract();
    const nTokenContract: Contract | undefined = useNTokenContract(tokenAddress);
    const voteContract: Contract | undefined = useVoteContract(true);
    const ledgerContract: Contract | undefined = useLedgerContract(true);

    useEffect(() => {
        let hasCheckValue=cookie.load('hasCheck');
        console.log("hasCheckValue",hasCheckValue);
        setHasCheck(hasCheckValue);
    }, []);

    useEffect(() => {
        contractReeming?.quotaOf(tokenAddress).then((res: any) => {
            setQuota(Number(formatCoinAmount(res.toString())))
        });
        contractPricing?.latestPrice(tokenAddress).then((res: any) => {
            setCurrentOraclePrice(Number(formatCoinAmount(res.price.toString())));
        });
        contractPricing?.getConfig().then((res: any) => {
            setOracleFee(res.singleFee * 0.0001);
        });
        ledgerContract?.totalRewards(tokenAddress).then((res: any) => {
            setTotalRewards(Number(formatCoinAmount(res.toString())));
        });
    },[contractReeming, contractPricing, ledgerContract, loading]);

    useEffect(() => {
        nTokenContract?.balanceOf(ledgerAddress).then((res: any) => {
            setDaoLockAmount(formatCoinAmount(res.toString()));
        });
        nTokenContract?.balanceOf(blackHoleAddr).then((res: any) => {
            setBurnAmount(formatCoinAmount(res.toString()));
        });
        nTokenContract?.balanceOf(account).then((res)=>{
          setBalance(formatCoinAmount(res.toString()));
        });
        nTokenContract?.allowance(account, redeemAddress).then((res: any) => {
            setCurrAllowance(formatCoinAmount(res.toString()));
        });
        if(UpperTokenName=="NEST"){
            voteContract?.getNestCirculation().then((res: any) => {
                setNestCirculation(formatCoinAmount(res.toString()));
            });
        }else{
            nTokenContract?.totalSupply().then((res: any) => {
                setNestCirculation(formatCoinAmount(res.toString()));
            });
        }
    },[redeemAddress, nTokenContract, voteContract, account])

    const doAuthorize= () => {
            if(loading){
                return ;
            }
            setLoading(true);
            nTokenContract?.approve(redeemAddress, MaxUint256)
                .then((tx: TransactionResponse) => {
                    showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
                    tx.wait(1).then((receipt: TransactionReceipt) => {
                        console.log("TransactionReceipt",receipt);
                        if(receipt.status){
                            let hasCheckValue=cookie.load('hasCheck');
                            setHasCheck(hasCheckValue);
                            setLoading(false);
                            setCurrAllowance(formatCoinAmount(MaxUint256.toString()))
                            showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
                        }

                    }).catch(function(err: any) {
                        showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                        setLoading(false);
                    });
                }).catch(function(err: any) {
                    if(err.code === 4001 ){
                      showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                    } else {
                      showSnackBar(i18n.t('The request failed'));
                    }
                    setLoading(false);
                });


    }
    const doParticipate = () => {
        if(loading){
            return ;
        }
        if(hasCheck != "checked"){
            showSnackBar(i18n.t('Please agree to the risk warning first'));
            return ;
        }
        if(miniValue < Number(amount)){
            showSnackBar(i18n.t('Exceeds the maximum saleable quantity'));
            return ;
        }
        if(Number(balance) < Number(amount)){
            showSnackBar(i18n.t('Insufficient balance'));
            return ;
        }
        if(!loading){
            setLoading(true);
            let overrides = {
                from:account,
                value: ethers.utils.parseEther(oracleFee.toString())     // ether in this case MUST be a string
            };
            contractReeming?.redeem(tokenAddress, ethers.utils.parseEther(amount), account, overrides)
                .then((tx: TransactionResponse) => {
                    showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'))
                    tx.wait(1).then((receipt: TransactionReceipt) => {
                        setAmount("");
                        setLoading(false);
                        forceUpdate(1);
                        // alert("Unstake Successfully!");
                        showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
                    }).catch((err: any)=>{
                        showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                        setLoading(false);
                    });
                }).catch(function(err: any) {
                    if(err.code === 4001 ){
                      showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                    } else {
                      showSnackBar(i18n.t('The request failed'));
                    }
                    setLoading(false);
                });
        }
    }

    const doCheckBox=() => {
        if(hasCheck=="none"){
            setHasCheck("checked");
            cookie.save('hasCheck',"checked");
        }else{
            setHasCheck("none");
            cookie.save('hasCheck',"none");
        }

    }

  return (
    <div>
      <PageNav title={i18n.t("nToken Repurchase", {token:UpperTokenName})}/>
      <div className="descriptionContainer">
        <div>{i18n.t('about_Dao_one')}
        </div>
        <div className={styles.aboutMarginTop}>
            <span className={styles.fontWeightClass}>{i18n.t('about_Dao_two')}</span> {i18n.t('about_Dao_three')}
        </div>
        <div className={styles.aboutMarginTop}>
            {i18n.t('about_Dao_four')}
        </div>
          <CheckBoxCmm
              text={i18n.t('I have read and understand the risks')}
              className={styles.aboutMarginTop}
              checkedVal={hasCheck=="checked"}
              onChange={doCheckBox}
          />
      </div>
      <div className="addressContainer">
        <div className={styles.addressRow}>
          <div className="addressRowLabel"> {i18n.t('DAO Contract Address')}</div>
          <div className="addressRowValue">
            { redeemAddress }
          </div>
        </div>
      </div>
        <div className={styles.swapDataContainer}>
            <div className={styles.swapDataValueContainer}>
                <div className={styles.leftSwap}>
                    <div className={styles.card}>
                        <div className={styles.cardValue}>{formatPrecisionAmount(nestCirculation, 0)} {UpperTokenName}</div>
                        <div className={styles.cardLabel}>{i18n.t('Current liquidity')}</div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardValue}>{formatPrecisionAmount(daoLockAmount, 0)} {UpperTokenName}</div>
                        <div className={styles.cardLabel}>{i18n.t('DAO lock amount')}</div>
                    </div>
                    <div className={styles.card}>
                        <div className={styles.cardValue}>{formatPrecisionAmount(burnAmount, 0)} {UpperTokenName}</div>
                        <div className={styles.cardLabel}>{i18n.t('Oracle auction burn volume')}</div>
                    </div>
                </div>
                <div className={styles.rightSwap}>
                    <div className={styles.rightSwapData}>
                        <div className={styles.rightCard}>
                            <div className={styles.rightCardValue}>{formatPrecisionAmount(miniValue, 0)} {UpperTokenName}</div>
                            <div className={styles.rightCardLabel}>{i18n.t('Current Maximun Participate', {token:UpperTokenName})}</div>
                        </div>
                        <div className={styles.rightCard}>
                            <div className={styles.rightCardValue}>{currentOraclePriceValue == 0? 0 : formatPrecisionAmount(1/Number(currentOraclePriceValue), 7)} ETH</div>
                            <div className={styles.rightCardLabel}>{i18n.t('Current Oracle Price',{token:UpperTokenName})}</div>
                        </div>
                    </div>
                    <div className={styles.rightSwapExecute}>
                        <div className={styles.actionTitle}>{i18n.t('Type participling amount',{token:UpperTokenName})}</div>
                        <div className={styles.actionInput}>
                            <NumberInput
                                className="input-grey"
                                onChange={setAmount}
                                value={amount}
                                placeholder="0"
                                decimal={0}
                            />
                        </div>
                        <div className={styles.cardBalance}>{i18n.t('nToken Balance', {token:UpperTokenName})}: {formatPrecisionAmount(balance, 4)}</div>
                        <div className={styles.buttonGroup}>
                            {
                                Number(currAllowance) == 0
                                    ? <Button
                                        text={i18n.t('Authorize')}
                                        onClick={doAuthorize}
                                        className={`${styles.button} button-pink`}
                                        loading={loading}
                                    />
                                    : <Button
                                        disabled={ Number(amount) === 0 }
                                        text={i18n.t('Participate')}
                                        onClick={doParticipate}
                                        className={`${styles.button} button-pink`}
                                        loading={loading}
                                    />
                            }
                        </div>
                    </div>
                </div>
            </div>


        </div>
    </div>
  );
}
