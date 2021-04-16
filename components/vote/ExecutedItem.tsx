import styles from "./Voting.module.scss";
import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";

import {
  TransactionReceipt,
  TransactionResponse,
  Web3Provider,
} from "@ethersproject/providers";
import { useWeb3React } from "@web3-react/core";
import { formatPrecisionAmount, showMessage, showPendingMessage, showSnackBar } from "../../utils";
import { formatEther } from '@ethersproject/units';
import Button from "../common/Button/Button";
import _ from "lodash";
import {useI18n} from "next-localization";
import LeftBar from "./LeftBar";
import RightBar from "./RightBar";
import { useVoteContract } from "../../hooks";
import { IVotingItem } from '../../services';

interface Props {
  item: IVotingItem;
  icon: string;
}

export default function ExecutedItem(props: Props) {
  const i18n = useI18n();
  const {account} = useWeb3React<Web3Provider>();
  const item = props.item;
  const circulation = item.nestCirculation;
  const addr = item.contractAddress;
  const start_time = item.startTime;
  const end_time = item.stopTime;
  const description = item.brief;
  const index = item.index;
  const [voteValue, setVoteValue] = useState(Number(formatEther(item.gainValue)));
  const [myVote, setMyVote] = useState(0);
  const [rate, setRate] = useState(0);

  const contract: Contract | undefined = useVoteContract(true);

  const [loading, setLoading] = useState<boolean>(false);

  useEffect((): any => {
    setRate(item.gainValue * 100 / circulation);
    setVoteValue(Number(formatEther(item.gainValue)));
  },[item.gainValue]);

  useEffect((): any => {
    contract?._stakedLedger(index, account).then((res: any) => {
      setMyVote(Number(formatEther(res)));
    });
  },[contract, loading]);


  const doWithdraw = () => {
    if(loading){
      return ;
    }
    if (contract) {
      if(!loading) {
        setLoading(true);
        contract.withdraw(index)
            .then((tx: TransactionResponse) => {
              showPendingMessage(i18n.t('Trading package'), i18n.t('The transaction can be viewed in the wallet'));
              tx.wait(1).then((receipt: TransactionReceipt) => {
                setMyVote(0);
                setLoading(false);
                // alert("Unstake Successfully!");
                showMessage('success', i18n.t('Successful transaction'), i18n.t('The transaction can be viewed in the wallet'));
              }).catch(function (err: any) {
                showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
                setLoading(false);
              });
            }).catch(function (err: any) {
              showSnackBar(i18n.t('The request failed'));
              setLoading(false);
            });
      }
    } else {
      showMessage('error', i18n.t('Transaction failed'), i18n.t('The transaction can be viewed in the wallet'));
    }
  };

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
          <LeftBar color={props.icon} rate={rate} vote_amount={voteValue.toString()} start_time={start_time} end_time={end_time} />
        </div>
        <div className={styles.swapDataValue}>
          <RightBar description={description}/>
        </div>
      </div>
      <div className={styles.execButton} style={Number(myVote) !== 0 ? {} : { display: 'none' }}>
        <span>{i18n.t('My votes (NEST)')}: {formatPrecisionAmount(myVote, 4)}</span>
        <Button
            disabled={Number(myVote) == 0}
            text={i18n.t('Withdraw')}
            onClick={doWithdraw}
            loading={loading}
            className="button-pink"
          />
      </div>
    </div>
    </div>
  );
}
