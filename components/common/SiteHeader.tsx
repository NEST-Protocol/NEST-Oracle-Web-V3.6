import styles from './SiteHeader.module.scss'
import MetaMaskConnect from './MetaMaskConnect';
import LanguageSelector from './LanguageSelector';
import Head from "next/head";
import {useI18n} from 'next-localization';
import Link from "next/link";
import {useRouter} from 'next/router';

export default function SiteHeader() {
    const i18n = useI18n();
    const router = useRouter();
    const isVote = router.asPath === '/vote'
    return (<div className={`${styles.container} titleBold`}>
        <Head>
            <title>NEST Web 3.6</title>
        </Head>
        <div className={styles.innerContainer}>
            <img className={styles.logo} src="/static/images/nestlogo.svg"/>
            <ul className={styles.navigationMainData}>  
              <li className={!isVote ? styles.active : ""}>
                <Link href="/">{i18n.t('Oracles')}</Link>
              </li>
              <li className={isVote ? styles.active : ""}>
                <Link href={{ pathname: '/vote' }}>{i18n.t('Vote')}</Link>
              </li>
            </ul>
            <div className={styles.right}>
                <MetaMaskConnect/>
                <LanguageSelector/>
            </div>
        </div>
    </div>);
}
