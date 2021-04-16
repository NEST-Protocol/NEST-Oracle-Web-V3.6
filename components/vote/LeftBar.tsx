import styles from "./Voting.module.scss";
import { formatPrecisionAmount } from "../../utils";
import _, { toInteger } from "lodash";
import {useI18n} from "next-localization";

interface Props {
  color?: string;
  rate: number;
  vote_amount: string;
  start_time: number;
  end_time: number;
}

export default function LeftBar(props: Props) {
  const { color, rate, vote_amount, start_time, end_time } = props;
  const i18n = useI18n()
  const icon = color ? color : ""
  function formatDate(date: number) {
    let tzoffset = (new Date()).getTimezoneOffset() * 60000; //offset in milliseconds
    let iso = (new Date(date * 1000 - tzoffset)).toISOString().slice(0, -1);
    let d = iso.split('T')[0];
    let t = iso.split('T')[1].substring(0, 5);
    return d + " " + t;
  }
  return (
    <div className={styles.card}>
      <div className={styles.cardIcon}>
      {icon === "" ? 
        <div className={`c100 p${toInteger(rate)}`}>
          <span>{formatPrecisionAmount(rate, 2)}%</span>
          <div className="slice">
              <div className="bar"></div>
              <div className="fill"></div>
          </div>
        </div>
        :
        <img className={styles.logo} src={`/static/images/${icon}.png`}/>
      }
      </div>
      <div className={styles.cardLabel}>
        <div style={icon === "" ? {} : { display: 'none' }}>
          <div className={styles.label}>{i18n.t('Votes')}</div>
          <div className={styles.votesValue}>{formatPrecisionAmount(vote_amount, 0)}</div>
        </div>
        <div className={styles.time}>
          <div>
            <div className={styles.label}>{i18n.t('Starting time')}</div>
            <div>{formatDate(start_time)}</div>
          </div>
          <div>
            <div className={styles.label}>{i18n.t('End time')}</div>
            <div className={styles.endTime}>{formatDate(end_time)}</div>
          </div>
        </div>
      </div>
    </div>
  );
}
