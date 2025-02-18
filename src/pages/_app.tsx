import { getCookie } from 'cookies-next'
import type { AppContext, AppProps } from 'next/app'
import App from 'next/app'
import Head from 'next/head'
import dynamic from 'next/dynamic'
import { useRouter } from 'next/router'
import { useMemo } from 'react'
import Decimal from 'decimal.js'
import { isLocal } from '../utils/common'

import i18n from '../i18n'
import { isClient } from '../utils/common'
import '@/components/Toast/toast.css'
import '@/components/LandingPage/components/tvl.css'
import '@/components/LandingPage/liquidity.css'
import 'react-day-picker/dist/style.css'
import { GoogleAnalytics } from '@next/third-parties/google'
import '../styles.css'
import Fluid from '@/components/Fluid'

const DynamicProviders = dynamic(() => import('@/provider').then((mod) => mod.Providers))
const DynamicContent = dynamic(() => import('@/components/Content'))
const DynamicAppNavLayout = dynamic(() => import('@/components/AppLayout/AppNavLayout'))

const CONTENT_ONLY_PATH = ['404', '/docs/disclaimer', '/moonpay']
const OVERFLOW_HIDDEN_PATH = ['/liquidity-pools']

Decimal.set({ precision: 1e3 })

const MyApp = ({ Component, pageProps, lng, ...props }: AppProps & { lng: string }) => {
  const { pathname } = useRouter()

  const [onlyContent, overflowHidden] = useMemo(
    () => [CONTENT_ONLY_PATH.includes(pathname), OVERFLOW_HIDDEN_PATH.includes(pathname)],
    [pathname]
  )

  // if (isLocal()) {
  //   const lang = lng || (getCookie('i18nextLng') as string) || 'en'
  //   i18n.changeLanguage(lang)
  // }

  return (
    <>
      <GoogleAnalytics gaId="G-DR3V6FTKE3" />
      <Head>
        <meta name="viewport" content="width=device-width, initial-scale=1, maximum-scale=1, user-scalable=no" />
        <meta name="twitter:image" content="/images/logo-text-light.png" />
        <meta name="twitter:card" content="summary_large_image" />
        <meta name="twitter:site" content="@Official USAProtocol" />
        <meta name="twitter:creator" content="@Official USAProtocol" />
        <meta name="twitter:title" content="Official USA" />
        <meta name="twitter:description" content="The Official USA Token Dashboard " />
        <meta property="og:description" content="The Official USA Token Dashboard " />
        <meta property="og:url" content="https://testapp2024.vercel.app/" />
        <meta property="og:type" content="website" />
        <meta property="og:image" content="/images/logo-text-light.png" />
        <meta property="og:image:alt" content="Official USA" />
        <meta property="og:locale" content="en" />
        <meta property="og:site_name" content="Official USA" />
        <meta property="og:title" content="Swap | Official USA" />
        <link rel="preconnect" href="https://rsms.me/" />
        <link rel="stylesheet" href="https://rsms.me/inter/inter.css" />
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" />
        <link href="https://fonts.googleapis.com/css2?family=Metrophobic&family=Orbitron:wght@400..900&display=swap" rel="stylesheet" />

        <title>{pageProps?.title ? `${pageProps.title} Official USA` : 'Official USA'}</title>
      </Head>
      <DynamicProviders>
        <DynamicContent {...props}>
          {onlyContent ? (
            <Component {...pageProps} />
          ) : (
            <DynamicAppNavLayout overflowHidden={overflowHidden}>
              {/* <Fluid /> */}
              <Component {...pageProps} />
            </DynamicAppNavLayout>
          )}
        </DynamicContent>
      </DynamicProviders>
    </>
  )
}

MyApp.getInitialProps = async (appContext: AppContext) => {
  if (isClient()) return {}
  try {
    const ctx = await App.getInitialProps(appContext)
    let lng = getCookie('i18nextLng', { req: appContext.ctx.req, res: appContext.ctx.res }) as string
    lng = lng || 'en'
    i18n.changeLanguage(lng)

    return ctx
  } catch (err) {
    return {}
  }
}

export default MyApp
