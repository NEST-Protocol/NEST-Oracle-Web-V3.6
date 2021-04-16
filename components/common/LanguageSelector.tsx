import styles from './LanguageSelector.module.scss'
import DropdownList, {DropdownOption} from '../ui/DrowdownList';
import {useCallback, useEffect, useMemo, useState} from 'react';
import {useRouter} from 'next/router';
import {useI18n} from 'next-localization';
import {RootState} from '../../store/reducers';
import { useSelector, useDispatch } from 'react-redux'
import {changeLanguage} from '../../store/language/actions';

export default function LanguageSelector() {
    const router = useRouter();
    const i18n = useI18n();
    const dispatch = useDispatch();

    const options = useMemo<DropdownOption[]>(()=>{
        return [
            {
                text: 'EN',
                value: 'en'
            },
            {
                text: 'ZH',
                value:'zh'
            }
        ];
    }, []);
    
    const lan = useSelector((state: RootState) => state.language);
    const [current, setCurrent] = useState(lan.language || router.locale);
    const onChangeLocale = useCallback(async (option: DropdownOption)=>{
        setCurrent(option.value)
        dispatch(changeLanguage({language: option.value}))
    }, []);
    useEffect(() => {
        (async () => {
            if (current === 'en') {
                i18n.set('en', await import('../../locales/en.json'));
                i18n.locale('en');
            } else if (current === 'zh') {
                i18n.set('zh', await import('../../locales/zh.json'));
                i18n.locale('zh');
            }})()
    }, [current, router]);
    return <div className={styles.container}>
        <DropdownList className={styles.list} options={options} onSelect={onChangeLocale} value={current}/>
    </div>;
}
