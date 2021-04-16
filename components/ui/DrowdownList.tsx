import React, {useCallback, useMemo, useState} from 'react';
import cls from 'classnames'
import {CSSTransition} from 'react-transition-group';
import styles from './DropdownList.module.scss';
import {useI18n} from "next-localization";
export declare interface DropdownOption {
    text: string,
    value: any
}

export declare interface DropdownListProps {
    value: any;
    className: string;
    options: DropdownOption[];
    onSelect: (value: any) => void;
}

export default function DropdownList({onSelect, value, options, className}: DropdownListProps) {
    const i18n = useI18n();
    const current = useMemo(()=>{
        return options.find(option => option.value === value)
    }, [value])
    const [listShow, setListShow] = useState(false)
    const arrowCls = useMemo(()=>{
        return cls('icondown_arrow', 'iconfont', styles.arrow, {
            collapse: listShow
        })
    }, [listShow])
    const onClick = useCallback(()=>{
        setListShow(!listShow)
    }, [listShow])
    const onSelectItem = useCallback((option)=>{
        onSelect(option)
        setListShow(false)
    }, [])

    return <div className={cls(styles.container, className)}>
        <div className={styles.current} onClick={onClick}>
            <span className={'subBold'}>{i18n.t(current!.text)}</span>
            <span className={arrowCls}></span>
        </div>
        <CSSTransition
            in={listShow}
            timeout={300}
            classNames="dropdownOptions"
            unmountOnExit
        >
            <div className={styles.dropdownOptionsWrapper}>
                <ul className={styles.dropdownOptions}>
                    {
                        options.map((option)=>{
                            return <Item key={option.value} option={option} value={i18n.t(option.text)} onSelect={onSelectItem}/>
                        })
                    }
                </ul>
            </div>
        </CSSTransition>
    </div>
}
declare interface ItemProps {
    option: DropdownOption;
    value:String;
    onSelect: (value: any) => void;
}
export function Item ({option,value, onSelect}:ItemProps){
    const onClick = useCallback(()=>{
        onSelect(option)
    }, [])
    return <li className={'subBold'} onClick={onClick}>
        {

            value
        }
    </li>
}
