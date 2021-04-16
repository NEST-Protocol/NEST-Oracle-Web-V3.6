import styles from "./Voting.module.scss";
import _ from "lodash";
import {useI18n} from "next-localization";

export default function VotingItem() {
  const i18n = useI18n()

  return (
    <div className={styles.noInfo}>
      <img src="/static/images/empty.svg"/>
      <span>{i18n.t('No information')}</span>
    </div>
  );
}
