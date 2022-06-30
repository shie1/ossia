import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { LoadingOverlay, MantineProvider } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { useState } from 'react'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)

  setInterval(() => {
    if (typeof window !== 'undefined' && document.documentElement.hasAttribute('data-loading')) {
      const dat = JSON.parse((document.documentElement.getAttribute('data-loading') as "true" | "false"))
      if (dat != loading) {
        setLoading(dat)
      }
    }
  }, 200)

  return (<>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{
      focusRing: 'auto',
      defaultRadius: 'md',
      white: "#F5F3F4",
      black: "#0B090A",
      colors: {
        "red": ['#A4161A', '#961419', '#8A1317', '#7F1115', '#731013', '#680E11', '#5C0D0F', '#510B0D', '#45090B', '#3A080A'],
        "indigo": ['#590288', '#53027E', '#4C0274', '#46026B', '#3F0161', '#390157', '#33014E', '#2C0144', '#26013A', '#200130'],
        "purple_plum": ['#9E5DB9', '#9650B4', '#8C48A9', '#81439C', '#773D8F', '#6C3882', '#613275', '#562D68', '#4B275B', '#41214E'],
        "light": ['#FFFFFF', '#EDEDED', '#DBDBDB', '#C8C8C8', '#B6B6B6', '#A4A4A4', '#929292', '#808080', '#6D6D6D', '#5B5B5B']
      },
      primaryColor: "purple_plum",
      primaryShade: 0,
      fontFamily: "Sora",
      fontFamilyMonospace: "Inconsolata",
      dir: 'ltr',
      loader: 'bars',
      dateFormat: "YYYY/MM/DD",
      colorScheme: "dark"
    }}>
      <ModalsProvider>
        <NotificationsProvider>
          <LoadingOverlay visible={loading} sx={{ position: 'fixed' }} />
          <audio id='ossia-main-player' onLoadStart={() => { document.documentElement.setAttribute('data-loading', 'true') }} onLoadedData={() => { document.documentElement.setAttribute('data-loading', 'false') }} />
          <Component {...pageProps} />
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  </>)
}

export default MyApp
