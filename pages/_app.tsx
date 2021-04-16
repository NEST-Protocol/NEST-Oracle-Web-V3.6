import '../styles/globals.scss'
import Head from 'next/head'
import { Web3ReactProvider } from '@web3-react/core'
import { Web3Provider } from '@ethersproject/providers'
import SiteLayout from '../components/common/SiteLayout';
import type { AppProps /*, AppContext */ } from 'next/app'
import { I18nProvider } from 'next-localization';
import { useRouter } from 'next/router';
import { Provider } from 'react-redux'
import store from '../store/store'

function getLibrary(provider: any): Web3Provider {
  const library = new Web3Provider(provider);
  library.pollingInterval = 15000;
  return library;
};

declare global {
  interface Window { ethereum: any; }
};

function MyApp({Component, pageProps }: AppProps) {
  const router = useRouter();
  const { lngDict, ...rest } = pageProps;
  const locale = router.locale || 'zh';

  return (<Web3ReactProvider getLibrary={getLibrary}>
    <Head>
      <script type='text/javascript' src={'//at.alicdn.com/t/font_2251994_jpn9fda7kh.js'} defer />
    </Head>
    <Provider store={store}>
      <I18nProvider lngDict={lngDict} locale={locale}>
        <SiteLayout>
          <Component {...rest} />
        </SiteLayout>
      </I18nProvider>
    </Provider>
  </Web3ReactProvider>);
}
export default MyApp;
