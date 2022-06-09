import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Affix, Header, MantineProvider, Modal, Text, Title, Container, Space, LoadingOverlay, Drawer, ActionIcon, Image, Divider, InputWrapper, Slider, Group, AppShell, Navbar } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { useEffect, useState } from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Link from 'next/link';
import { BrandYoutube, PlayerPause, PlayerPlay, Volume, VolumeOff, Download, Heart } from 'tabler-icons-react'

function MyApp({ Component, pageProps }: AppProps) {
  const [volume, setVolume] = useState(100)
  const [loading, setLoading] = useState<boolean>(false)
  const [dw, setDw] = useState(false)
  const [prevVol, setPrevVol] = useState(100)
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
    if (typeof window !== 'undefined') {
      document.getElementsByTagName('audio')[0].volume = volume / 100
    }
  }, [volume])

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
        <div style={{ display: 'none' }}>
          <Divider my='sm' />
          <InputWrapper label="Volume">
            <Slider value={volume} onChange={setVolume} marks={[
              { value: 0, label: '0%' },
              { value: 50, label: '50%' },
              { value: 100, label: '100%' },
            ]} />
          </InputWrapper>
          <Space h='lg' />
        </div>
        <Group my='sm' position="center">
          <ActionIcon onClick={mute}>
            {volume === 0 ? <VolumeOff /> : <Volume />}
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
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <NotificationsProvider>
          <div style={{ display: 'none' }} id='songDetails'>
            <h1 /><h2 /><div /><span /><p />
          </div>
          <LoadingOverlay visible={loading} />
          <audio autoPlay onChange={() => { setLoading(true) }} onEnded={() => { setPaused(true) }} onPause={() => { setPaused(true) }} onPlay={() => { setPaused(false) }} onLoadStart={() => { setLoading(true) }} onLoadedData={() => { setLoading(false) }} style={{ 'display': 'none' }} />
          <AppShell
            header={
              <Header height={60} p="xs">
                <Group sx={{display: 'flex',alignItems: 'center', justifyContent: 'center'}} position='center' direction='row'>
                  <Title className='title' sx={{ fontFamily: 'Comfortaa, sans-serif' }} mb='sm'><Link href='/'>Ossia</Link></Title>
                </Group>
              </Header>
            }>
            <Container p='sm'>
              <Component {...pageProps} />
              <Affix sx={{ padding: '.2rem .4rem', opacity: '.75' }}>
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
            </Container>
          </AppShell>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default MyApp
