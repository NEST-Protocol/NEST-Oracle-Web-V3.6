import styles from './SiteLayout.module.scss'
import SiteFooter from './SiteFooter'
import SiteHeader from './SiteHeader'
import React from 'react'
export declare interface PageHeaderProps {
    children: React.ReactNode
}
export default function SiteLayout(props: PageHeaderProps) {
    const { children } = props;
    return (<>
        <SiteHeader/>
        <div className={styles.container}>
            {
                children
            }
        </div>
        <div id="snackbar">Some text some message..</div>
        <SiteFooter/>
    </>);
}