import styles from "./Voting.module.scss";
import _ from "lodash";
import {useI18n} from "next-localization";

interface Props {
  description?: string;
}

export default function RightBar(props: Props) {
  const { description } = props;
  const i18n = useI18n()

  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
        <img className={styles.logo} src="/static/images/file.svg"/>
      </div>
      <div className={styles.cardLabel}>
        <div className={styles.votes}>
          <div className={styles.label}>{i18n.t('Proposal description')}</div>
          <div className={styles.proposalValue}>{ description }</div>
        </div>
      </div>
    </div>
  );
}
