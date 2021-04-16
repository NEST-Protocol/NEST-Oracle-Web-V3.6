import cls from 'classnames'
export declare interface IconProps {
    name: string;
    className?: string;
}
export default function Icon({ className, name, ...restProps }: IconProps) {
    return (
        <svg
            className={cls('icon', className)}
            aria-hidden="true"
            {...restProps}
        >
            <use xlinkHref={`#${name}`} />
        </svg>
    );
}