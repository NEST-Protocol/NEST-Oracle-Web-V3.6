import {GetStaticProps} from "next";
import PairList from '../components/home/PairList'
export default function Home() {
    return (<div>
        <PairList />
    </div>);
};

export const getStaticProps: GetStaticProps = async (context) => {
    const { default: lngDict = {} } = await import(`../locales/${context.locale}.json`);
    return {
        props: { lngDict }
    };
};
