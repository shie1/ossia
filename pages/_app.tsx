import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { ColorScheme, ColorSchemeProvider, MantineProvider, Modal, Text } from '@mantine/core'
import { NotificationsProvider } from '@mantine/notifications'
import { useState } from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });
  const [online, setOnline] = useState<boolean>(true)

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
        <NotificationsProvider>
          <Modal
            opened={!online}
            onClose={() => { }}
            title="Page offline"
            withCloseButton={false}
          >
            <Text>Can&apos;t connect to server, please check your internet connection!</Text>
          </Modal>
          <Component {...pageProps} />
        </NotificationsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default MyApp
