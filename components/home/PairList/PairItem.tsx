import styles from './PairItem.module.scss'
import {IPariItem} from '../../../services';
import {useI18n} from 'next-localization';
import Link from "next/link";
import _ from "lodash";
import { ethImgBackup } from '../../../utils';

export declare interface PairItemProps {
    data: IPariItem
}
export default function PairItem(props: PairItemProps) {
    const data = props.data;
    const i18n = useI18n();
    const imgsrc= "/static/images/" + data.symbol + ".png";

    return(
    <div className={styles.container}>
        <img src={imgsrc} onError={ethImgBackup} />
        <div className={`${styles.pair} titleBold`}>
            ETH/{data.symbol}
        </div>
        <div className={styles.btns}>
            <Link href={{ pathname: '/income', query: { symbol: _.toLower(data.symbol),nAddress:data.nAddress } }}>
                <a className={`${styles.btn} subBold`}>{i18n.t('income')}</a>
            </Link>
            <Link href={{ pathname: '/dao', query: { symbol: _.toLower(data.symbol),nAddress:data.nAddress } }}>
                <a className={`${styles.btn} subBold`}>{i18n.t('DAO')}</a>
            </Link>
        </div>
    </div>);
}
