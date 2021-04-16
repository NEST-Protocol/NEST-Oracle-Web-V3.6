import { useEffect, useState } from "react";
import { Contract } from "@ethersproject/contracts";
import { useWeb3React } from "@web3-react/core";
import { formatCoinAmount} from "../../utils";
import _ from "lodash";
import {useI18n} from "next-localization";
import VotingItem from "./VotingItem";
import NoInfo from "./NoInfo";
import { getAddress, useNTokenContract } from "../../hooks";
import { IVotingItem } from '../../services';

interface Props {
  renderList: IVotingItem[];
  handler: () => void;
}

export default function Voting(props: Props) {
  const i18n = useI18n();
  const { account } = useWeb3React();
  const renderList = props.renderList
  const nestAddr = getAddress("NestToken");
  const contract: Contract | undefined = useNTokenContract(nestAddr, true);
  const [nestBalance, setNestBalance] = useState("0");
  useEffect(()=>{
    contract?.balanceOf(account).then((res)=>{
      setNestBalance(formatCoinAmount(res.toString()));
    })
  }, [contract, props.renderList]);
  
  return (
    <div>
    {
      renderList.length === 0 ? 
      <NoInfo />
      :
      renderList.map((item) => {
          return <VotingItem key={item.index} item={item} nestBalance={nestBalance} 
          handler={props.handler}/>
      })
    }</div>
  );
}
