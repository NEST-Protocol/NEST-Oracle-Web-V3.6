import styles from "./Voting.module.scss";
import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import NumberInput from "../common/Input/InputNumber";

import {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { showMessage, showPendingMessage, formatCoinAmount, formatPrecisionAmount, showRateBelow51, showSnackBar } from "../../utils";
import { formatEther } from '@ethersproject/units';
import { ethers } from 'ethers';
import Button from "../common/Button/Button";
import _ from "lodash";
import {useI18n} from "next-localization";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import { useVoteContract, useNTokenContract, getAddress } from "../../hooks";
import { IVotingItem } from '../../services';
import {MaxUint256} from "@ethersproject/constants";

interface Props {
  item: IVotingItem;
  nestBalance: string;
  handler: () => void;
}

export default function VotingItem(props: Props) {
  const i18n = useI18n();
  const {account} = useWeb3React<Web3Provider>();
  const item = props.item;
  const balance = props.nestBalance;
  const circulation = item.nestCirculation;
  const addr = item.contractAddress;
  const start_time = item.startTime;
  const end_time = item.stopTime;
  const description = item.brief;
  const index = item.index;
  const [voteValue, setVoteValue] = useState(Number(formatEther(item.gainValue)));
  const [myVote, setMyVote] = useState(0);
  const [rate, setRate] = useState(0);

  const [showBar, setShowBar] = useState(true)
  const [upOrDown, setUpOrDown] = useState("up")
  const [currAllowance , setCurrAllowance] = useState<string>('');
  const toggleBar = () => {
    if(!showBar) {
      setUpOrDown("up")
    } else {
      setUpOrDown("down")
    }
    setShowBar(!showBar);
  }

  const contract: Contract | undefined = useVoteContract(true);
  const nContract: Contract | undefined = useNTokenContract(getAddress("NestToken"));
  const voteAddress =  getAddress("NestVote");

  const [loading1, setLoading1] = useState<boolean>(false);
  const [loading2, setLoading2] = useState<boolean>(false);
  const [loading3, setLoading3] = useState<boolean>(false);
  const [amount1, setAmount1] = useState<string>("");

  useEffect((): any => {
    setRate(item.gainValue * 100 / circulation);
    setVoteValue(Number(formatEther(item.gainValue)));
  },[item.gainValue]);

  useEffect((): any => {
    contract?._stakedLedger(index, account).then((res: any) => {
      setMyVote(Number(formatEther(res)));
    });


    nContract?.allowance(account, voteAddress).then((res) => {
      setCurrAllowance(formatCoinAmount(res.toString()))
    })
  },[contract, loading1, loading2])

  const doAuthorize= () => {
    if(loading1){
      return ;
    }
    setLoading1(true);
    nContract?.approve(voteAddress, MaxUint256)
        .then((tx: TransactionResponse) => {
          tx.wait(1).then((receipt: TransactionReceipt) => {
            showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
            if(receipt.status){
              showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
              setLoading1(false);
              setCurrAllowance(formatCoinAmount(MaxUint256.toString()))
            }

          }).catch(function(err: any) {
            showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
            setLoading1(false);
          });
        }).catch(function(err: any) {
          if(err.code === 4001 ){
            showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
          } else {
            showSnackBar(i18n.t('The request failed'));
          }
            setLoading1(false);
          });
  };

  const doVoting = () => {
    if(loading1){
      return ;
    }
    if(balance < amount1){
      showSnackBar(i18n.t('Insufficient balance'));
      return ;
    }
    if (contract) {
      if(!loading1) {
        setLoading1(true);
        contract.vote(index, ethers.utils.parseEther(amount1))
            .then((tx: TransactionResponse) => {
              showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
              tx.wait(1).then((receipt: TransactionReceipt) => {
                // setVoteValue(voteValue + Number(amount1));
                props.handler();
                setAmount1('');
                setLoading1(false);
                // alert("Unstake Successfully!");
                showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
              }).catch(function (err: any) {
                showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                setLoading1(false);
              });
            }).catch(function (err: any) {
              if(err.code === 4001 ){
                showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
              } else {
                showSnackBar(i18n.t('The request failed'));
              }
              setLoading1(false);
            });
      }
    } else {
      showSnackBar(i18n.t('The request failed'));
    }
  }

  const doWithdraw = () => {
    if(loading2){
      return ;
    }
    if (contract) {
      if(!loading2) {
        setLoading2(true);
        contract.withdraw(index)
            .then((tx: TransactionResponse) => {
              showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
              tx.wait(1).then((receipt: TransactionReceipt) => {
                props.handler()
                setMyVote(0);
                setLoading2(false);
                // alert("Unstake Successfully!");
                showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
              }).catch(function (err: any) {
                showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                setLoading2(false);
              });
            }).catch(function (err: any) {
              if(err.code === 4001 ){
                showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
              } else {
                showSnackBar(i18n.t('The request failed'));
              }
              setLoading2(false);
            });
      }
    } else {
      showSnackBar(i18n.t('The request failed'));
    }
  }

  const execute = () => {
    if(loading3){
      return ;
    }
    if (contract) {
      if(!loading3) {
        setLoading3(true);
        contract.execute(index)
            .then((tx: TransactionResponse) => {
              showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
              tx.wait(1).then((receipt: TransactionReceipt) => {
                props.handler();
                setLoading3(false);
                // alert("Unstake Successfully!");
                showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
              }).catch(function (err: any) {
                showRateBelow51(i18n.t('Voting rate below 51'), i18n.t('confirm'));
                setLoading3(false);
              });
            }).catch(function (err: any) {
              if(err.code === 4001 ){
                showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
              } else if (err.message.indexOf("NestVote:!gainValue") !== -1) {
                showRateBelow51(i18n.t('Voting rate below 51'), i18n.t('confirm'));
              } else {
                showSnackBar(i18n.t('The request failed'));
              }
              setLoading3(false);
            });
      }
    } else {
      showSnackBar(i18n.t('The request failed'));
    }
  }

  return (
    <div>
    <div className="addressContainer">
      <div>
        <div className="addressRowLabel">{i18n.t('Contract Address')}</div>
        <div className="addressRowValue">
          {addr}
        </div>
      </div>
    </div>
    <div className={"dataContainer"}>
      <div className={"swapDataValueContainer"}>
        <div className={styles.swapDataValue}>
          <LeftBar rate={rate} vote_amount={voteValue.toString()} start_time={start_time} end_time={end_time} />
          <div className={styles.cardMax} style={showBar ? {} : { display: 'none' }}>
            <div className={styles.cardLabel}>{i18n.t('Enter the number of votes')}</div>
              <NumberInput
                className="input-grey"
                onChange={setAmount1}
                value={amount1}
                placeholder="0"
                decimal={0}
              />
              <div className={styles.cardValue}>{i18n.t('NEST Balance')}: {formatPrecisionAmount(balance, 4)}</div>
              { Number(currAllowance) == 0 ? 
                <Button
                text={i18n.t('Authorize')}
                onClick={doAuthorize}
                loading={loading1}
                className="button-pink"
              />
              :
                <Button
                  disabled={balance == '0' || !amount1}
                  text={i18n.t('Vote')}
                  onClick={doVoting}
                  loading={loading1}
                  className="button-pink"
                />
              }
          </div>
        </div>
        <div className={styles.swapDataValue}>
          <RightBar description={description}/>
          <div className={styles.cardMax} style={showBar ? {} : { display: 'none' }}>
            <div className={styles.cardLabel}>{i18n.t('My votes (NEST)')}:</div>
              <div className={styles.voteAmount}>{formatPrecisionAmount(myVote, 4)}</div>
              <Button
                disabled={myVote == 0}
                text={i18n.t('Cancel vote')}
                onClick={doWithdraw}
                loading={loading2}
                className="button-pink"
              />
          </div>
        </div>
      </div>
      <div style={rate >= 51 ? {} : { display: 'none' }}>
        <Button
            disabled={rate < 51}
            text={i18n.t('Execute')}
            onClick={execute}
            loading={loading3}
            className={styles.button}
          />
      </div>
      <div><img className={styles.logo} style={{height: '15px'}} src={`/static/images/${upOrDown}.svg`} onClick={toggleBar}/></div>
    </div>
    </div>
  );
}
