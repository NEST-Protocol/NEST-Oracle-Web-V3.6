import _ from "lodash";
import {useI18n} from "next-localization";
import ExecutedItem from "./ExecutedItem";
import NoInfo from "./NoInfo";
import { IVotingItem } from '../../services';

interface Props {
  renderList: IVotingItem[];
}

export default function Expired(props: Props) {
  const i18n = useI18n();
  const renderList = props.renderList

  return (
    <div>
    {
      renderList.length === 0 ? 
      <NoInfo />
      :
      renderList.map((item) => {
          return <ExecutedItem key={item.index} item={item} icon="expired"/>
      })
    }</div>
  );
}
