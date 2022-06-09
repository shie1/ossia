import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Affix, ColorScheme, ColorSchemeProvider, MantineProvider, Modal, Text, Title, Container, Space, LoadingOverlay, Drawer, ActionIcon, Image, Divider, InputWrapper, Slider, Group } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { useEffect, useState } from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Link from 'next/link';
import { BrandYoutube, PlayerPause, PlayerPlay, Volume, VolumeOff, Download } from 'tabler-icons-react'

function MyApp({ Component, pageProps }: AppProps) {
  const [colorScheme, setColorScheme] = useLocalStorage<ColorScheme>({
    key: 'color-scheme',
    defaultValue: 'dark',
  });
  const [volume, setVolume] = useState(100)
  const [loading, setLoading] = useState<boolean>(false)
  const [dw, setDw] = useState(false)
  const [fl, setFl] = useState<boolean>(true)
  const [prevVol, setPrevVol] = useState(100)
  const [online, setOnline] = useState<boolean>(true)
  const [appInfo, setAppInfo] = useState<any>(false)
  const [paused, setPaused] = useState(true)

  useEffect(() => {
    if (typeof window !== 'undefined' && !appInfo) {
      fetch(`${document.location.origin}/api/app`).then(async response => {
        setAppInfo(await response.json())
      })
    }
  }, [appInfo])

  useEffect(() => {
    if (fl) {
      setFl(false)
      setInterval(() => {
        if (typeof window !== 'undefined') {
          setOnline(window.navigator.onLine)
        }
      }, 500)
    }
  }, [fl])

  const toggleColorScheme = () =>
    setColorScheme((current) => (current === 'dark' ? 'light' : 'dark'));

  const play = () => {
    const audioE = document.querySelector('audio') as HTMLAudioElement
    if (audioE?.paused) {
      audioE?.play()
    } else {
      audioE?.pause()
    }
  }

  const mute = () => {
    if (volume == 0) {
      showNotification({
        'icon': <Volume />,
        'title': 'Unmuted',
        'message': '',
      })
      setVolume(prevVol)
    } else {
      showNotification({
        'icon': <VolumeOff />,
        'title': 'Muted',
        'message': '',
      })
      setPrevVol(volume)
      setVolume(0)
    }
  }

  useHotkeys([
    ['space', play],
    ['m', mute]
  ])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.getElementsByTagName('audio')[0].volume = volume / 100
    }
  }, [volume])

  const Player = () => {
    if (!document?.querySelector("#songDetails span")?.innerHTML) {
      return (
        <>
          <Text m='md' align='center'>No music playing!</Text>
        </>
      )
    }
    return (
      <div>
        <Image mb='sm' alt='a' src={document?.querySelector("#songDetails span")?.innerHTML} />
        <Group mb={1} spacing={4} direction='row'>
          <Text size='xl'>{document?.querySelector("#songDetails h1")?.innerHTML}</Text>
          <a href={`https://youtu.be/${document?.querySelector("#songDetails div")?.innerHTML}`} target='_blank' rel="noreferrer">
            <ActionIcon variant='transparent'>
              <BrandYoutube />
            </ActionIcon>
          </a>
        </Group>
        <Text size='sm'>{document?.querySelector("#songDetails h2")?.innerHTML}</Text>
        <Divider my='sm' />
        <InputWrapper label="Volume">
          <Slider value={volume} onChange={setVolume} marks={[
            { value: 0, label: '0%' },
            { value: 50, label: '50%' },
            { value: 100, label: '100%' },
          ]} />
        </InputWrapper>
        <Space h='lg' />
        <Group my='sm' position="center">
          <ActionIcon onClick={mute}>
            {volume === 0 ? <Volume /> : <VolumeOff />}
          </ActionIcon>
          <ActionIcon onClick={play}>
            {paused ? <PlayerPlay /> : <PlayerPause />}
          </ActionIcon>
          <a href={`${document?.location.origin}/api/stream?v=${document?.querySelector("#songDetails div")?.innerHTML}`} className='nodim' id='download' onClick={() => {
            showNotification({
              'title': 'Downloading',
              'message': 'The download has started, please wait!',
              'icon': <Download />,
              'id': 'Download'
            })
          }} download>
            <ActionIcon>
              <Download />
            </ActionIcon>
          </a>
        </Group>
      </div>
    )
  }

  return (
    <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
      <MantineProvider theme={{ colorScheme }} withGlobalStyles withNormalizeCSS>
        <ModalsProvider>
          <NotificationsProvider>
            <div style={{ display: 'none' }} id='songDetails'>
              <h1 /><h2 /><div /><span /><p />
            </div>

            <LoadingOverlay visible={loading} />
            <audio autoPlay onChange={() => { setLoading(true) }} onEnded={() => { setPaused(true) }} onPause={() => { setPaused(true) }} onPlay={() => { setPaused(false) }} onLoadStart={() => { setLoading(true) }} onLoadedData={() => { setLoading(false) }} style={{ 'display': 'none' }} />
            <Modal
              opened={!online}
              onClose={() => { }}
              title="Page offline"
              withCloseButton={false}
            >
              <Text>Can&apos;t connect to the server, please check your internet connection!</Text>
            </Modal>
            <Container p='sm'>
              <Title className='title' sx={{ fontFamily: 'Comfortaa, sans-serif' }} mb='sm' align='center'><Link href='/'>Ossia</Link></Title>
              <Component {...pageProps} />
            </Container>
            <Affix sx={{ padding: '.2rem', opacity: '.75' }}>
              <Text>{appInfo.fullName} {appInfo.version}</Text>
              {!dw ? <ActionIcon variant='outline' size='xl' m='sm' onClick={() => { setDw(!dw) }} sx={{ position: 'fixed', bottom: 0, left: 0, background: 'rgba(0,0,0,.5)' }}>
                <PlayerPlay />
              </ActionIcon> : <></>}
            </Affix>
            <Drawer
              opened={dw}
              onClose={() => setDw(false)}
              padding="xl"
              size="xl"
            >
              <Player />
            </Drawer>
            <Space h='xl' />
          </NotificationsProvider>
        </ModalsProvider>
      </MantineProvider>
    </ColorSchemeProvider>
  )
}

export default MyApp
