import styles from './SiteFooter.module.scss'
import {useI18n} from 'next-localization';

export default function SiteFooter() {
    const i18n = useI18n();
    return(
    <div className={styles.container}>
        <div className={styles.innerContainer}>
            <div className={`${styles.desc} tipsBold`}>
                {
                    i18n.t('Nest Desc')
                }
            </div>
            <ul className={`${styles.links} crossCenter`}>
                <li>
                    <a href={'https://github.com/NEST-Protocol'} className={`bodyBold`} target={"_blank"}>Github</a>
                </li>
                <li>
                    <a href={'https://www.reddit.com/r/nestprotocol/'} className={`bodyBold`}>Reddit</a>
                </li>
                <li>
                    <a href={'https://twitter.com/nest_protocol'} className={`bodyBold`} target={"_blank"}>Twitter</a>
                </li>
                <li>
                    <a href={'https://docs.nestprotocol.org'} className={`bodyBold`} target={"_blank"}>Docs</a>
                </li>
                <li>
                    <a href={'https://nestdapp.io/datashow/English.html'} className={`bodyBold`} target={"_blank"}>Data Review</a>
                </li>
            </ul>
        </div>
    </div>);
}
