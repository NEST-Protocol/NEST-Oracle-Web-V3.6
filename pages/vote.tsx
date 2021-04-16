import styles from "../styles/vote.module.scss";
import Voting from "../components/vote/Voting";
import Executed from "../components/vote/Executed";
import Expired from "../components/vote/Expired";
import {useI18n} from "next-localization";
import cookie from 'react-cookies'
import {useCallback, useEffect, useState} from "react";
import { Contract } from "@ethersproject/contracts";
import { useVoteContract } from "../hooks";
import { IVotingItem } from '../services';

export default function Home() {
  const i18n = useI18n()
  const [update, setUpdate] = useState(true);
  const [, forceUpdate] = useState<number>();
  const [subScreen, setSubScreen] = useState("Voting");
  const subScreenCookies=cookie.load('voteSubScreenCookies');
  let vlist : IVotingItem[] = [];
  let execlist : IVotingItem[] = [];
  let explist : IVotingItem[] = [];
  const [votingList, setVotingList] = useState(vlist);
  const [executedList, setExecutedList] = useState(execlist);
  const [expiredList, setExpiredList] = useState(explist);
  useEffect(()=>{
    if(subScreenCookies){
      setSubScreen(subScreenCookies)
    }
  }, [subScreenCookies])

  const handleSetSubScreen = useCallback((tab)=>{
    setSubScreen(tab)
    cookie.save('voteSubScreenCookies',tab);
  }, [])

  const contract: Contract | undefined = useVoteContract(true);

  useEffect((): any => {
    contract?.getProposeCount().then((num: any)=>{
      if(!num.isZero()){
        contract?.list(0, num.toNumber(), 0).then((res: any) => {
          res.map((item) => {
            let json : IVotingItem = {
              brief: item.brief,
              contractAddress: item.contractAddress,
              nestCirculation: item.nestCirculation,
              startTime: item.startTime,
              stopTime: item.stopTime,
              gainValue: item.gainValue,
              index: item.index.toNumber()
            };
            if (item.state === 0) {
              if ((new Date).getTime()/1000 > item.stopTime) {
                explist.push(json)
              } else {
                vlist.push(json)
              }
            } else if(item.state === 1) {
              execlist.push(json)
            }
          })
          setVotingList(vlist);
          setExecutedList(execlist);
          setExpiredList(explist);
          forceUpdate(1);
        }).catch((err)=>{})
      }
    })
  },[contract, update])


  const subScreenRender = () => {
    if (subScreen === "Voting") {
      return <Voting renderList={votingList} handler={handler} />;
    } else if (subScreen === "Executed") {
      return <Executed renderList={executedList} />;
    } else {
      return <Expired renderList={expiredList}  />
    }
  };

  const handler = () => {
    setUpdate(!update)
  }

  return (
    <div>
      <div className="descriptionContainer">
        {i18n.t('vote description')}
      </div>
      <div className={styles.naviContainer}>
        <ul className={styles.navigationMainData}>
          <li
            className={subScreen === "Voting" ? styles.active : ""}
            onClick={() => handleSetSubScreen("Voting")}
          >
            {i18n.t('Voting')}
          </li>
          <li>/</li>
          <li
            className={subScreen === "Executed" ? styles.active : ""}
            onClick={() => handleSetSubScreen("Executed")}
          >
            {i18n.t('Executed')}
          </li>
          <li>/</li>
          <li
            className={subScreen === "Expired" ? styles.active : ""}
            onClick={() => handleSetSubScreen("Expired")}
          >
            {i18n.t('Expired')}
          </li>
        </ul>
      </div>
        {subScreenRender()}
    </div>
  );
}
