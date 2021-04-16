import PageNav from "../components/common/PageNav";
import Withdraw from "../components/income/Withdraw";
import { getAddress } from "../hooks";
import {useRouter} from "next/router";
import _ from "lodash";
import { showPendingMessage } from "../utils";
import {useI18n} from "next-localization";
export default function Home() {
  const router = useRouter();
  const tokenName = router ? router.query.symbol : '';
  if(!tokenName) {
    return <></>
  }
  const i18n = useI18n()
  const UpperTokenName = tokenName ? _.toUpper(tokenName as any)!="USDT" ? "n"+_.toUpper(tokenName as any):"NEST" : '';
  const tokenAddress = router ? router.query.nAddress : '';

  if(!tokenAddress){
    showPendingMessage('error', 'tokenAddress not found')
    return null;
  }

  return (

    <div>
      <PageNav title={"ETH/" +_.toUpper(tokenName as any)+ " Oracle"} />
      <div className="descriptionContainer">
        {i18n.t('cancel staking')}
      </div>
      <div className="addressContainer">
        <div>
          <div className="addressRowLabel">{i18n.t('Income contract address')}</div>
          <div className="addressRowValue">
            { getAddress("NestStakingAddress") }
          </div>
        </div>
        <div>
          <div className="addressRowLabel">{i18n.t('token address',{token:UpperTokenName})}</div>
          <div className="addressRowValue">
            { tokenAddress }
          </div>
        </div>
      </div>
      <Withdraw />
    </div>
  );
}
