import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Affix, ColorScheme, ColorSchemeProvider, MantineProvider, Modal, Text, Title, Container, Space } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications'
import { useEffect, useState } from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Link from 'next/link';

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });
  const [online, setOnline] = useState<boolean>(true)
  const [appInfo, setAppInfo] = useState<any>(false)

  useEffect(() => {
    if (typeof window !== 'undefined' && !appInfo) {
      fetch(`${document.location.origin}/api/app`).then(async response => {
        setAppInfo(await response.json())
      })
    }
  }, [appInfo])

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const checkCon = setInterval(() => {
    if (typeof window !== 'undefined') {
      setOnline(window.navigator.onLine)
    }
  }, 500)

  useHotkeys([
    ['ctrl+J', () => { toggleColorScheme() }],
    ['ctrl+L', () => { setOnline(true); clearInterval(checkCon) }],
  ])

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <NotificationsProvider>
            <Modal
              opened={!online}
              onClose={() => { }}
              title="Page offline"
              withCloseButton={false}
            >
              <Text>Can&apos;t connect to server, please check your internet connection!</Text>
            </Modal>
            <Container p='sm'>
              <Title sx={{ fontFamily: 'Comfortaa, sans-serif' }} mb='sm' align='center'><Link href='/'>Ossia</Link></Title>
              <Component {...pageProps} />
            </Container>
            <Affix sx={{padding: '.2rem', opacity: '.75'}}>
              <Text>{appInfo.fullName} {appInfo.version}</Text>
            </Affix>
            <Space h='xl' />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default MyApp
