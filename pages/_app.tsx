import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Affix, Header, MantineProvider, Modal, Text, Title, Container, Space, LoadingOverlay, Drawer, ActionIcon, Image, Divider, InputWrapper, Slider, Group, AppShell, Navbar, Popover, AspectRatio } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { useEffect, useState } from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Link from 'next/link';
import { BrandYoutube, PlayerPause, PlayerPlay, Volume, VolumeOff, Download, Books, Home, Heart, Heartbeat, X } from 'tabler-icons-react'

function MyApp({ Component, pageProps }: AppProps) {
  const [volume, setVolume] = useLocalStorage({
    key: 'volume', defaultValue: 100
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [dw, setDw] = useState(false)
  const [prevVol, setPrevVol] = useState(100)
  const [appInfo, setAppInfo] = useState<any>(false)
  const [paused, setPaused] = useLocalStorage(
    { key: 'paused', defaultValue: true }
  )
  const [liked, setLiked] = useLocalStorage<Array<any>>(
    { key: 'liked-songs', defaultValue: [] }
  );
  const [history, setHistory] = useLocalStorage<Array<any>>(
    { key: 'history', defaultValue: [] }
  );

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

  const clearSong = () => {
    const audioE = document.querySelector('audio') as HTMLAudioElement
    audioE.src = ''
    const detailsE = document.querySelector('#songDetails') as HTMLDivElement
    detailsE.querySelector('h1')!.innerHTML = ''
    detailsE.querySelector('h2')!.innerHTML = ''
    detailsE.querySelector('div')!.innerHTML = ''
    detailsE.querySelector('span')!.innerHTML = ''
    detailsE.querySelector('p')!.innerHTML = ''
    setDw(false)
  }

  const addLike = () => {
    const song = {
      'id': document.querySelector("#songDetails div")?.innerHTML,
      'title': document.querySelector("#songDetails h1")?.innerHTML,
      'thumbnail': document.querySelector("#songDetails span")?.innerHTML,
      'added': (new Date()).toUTCString()
    }

    const take = (list: any, val: any) => {
      return list.filter((value: any, index: any, arr: any) => {
        return value.id != val;
      });
    }

    const id = document.querySelector("#songDetails div")!.innerHTML
    if (isLiked(id)) {
      setLiked(take(liked, id));
    } else {
      setLiked(oldArray => [song, ...oldArray]);
    }
  }

  const addHistory = () => {
    const song = {
      'id': document.querySelector("#songDetails div")?.innerHTML,
      'title': document.querySelector("#songDetails h1")?.innerHTML,
      'thumbnail': document.querySelector("#songDetails span")?.innerHTML,
      'added': (new Date()).toUTCString()
    }

    const id = document.querySelector("#songDetails div")!.innerHTML
    if (history.length >= 24) {
      setHistory(oldArray => [song, ...oldArray.slice(1)]);
    } else {
      setHistory(oldArray => [song, ...oldArray]);
    }
  }

  const isLiked = (song: string) => {
    return liked.findIndex(item => item.id == song) != -1
  }

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
        <AspectRatio mb='sm' ratio={1280 / 720}>
          <Image alt='a' src={document?.querySelector("#songDetails span")?.innerHTML} />
        </AspectRatio>
        <Group mb={1} spacing={4} direction='row'>
          <Text size='xl'>{document?.querySelector("#songDetails h1")?.innerHTML}</Text>
          <a href={`https://youtu.be/${document?.querySelector("#songDetails div")?.innerHTML}`} target='_blank' rel="noreferrer">
            <ActionIcon variant='transparent'>
              <BrandYoutube />
            </ActionIcon>
          </a>
        </Group>
        <Text size='sm'>{document?.querySelector("#songDetails h2")?.innerHTML}</Text>
        <Group my='sm' position="center">
          <ActionIcon size='xl' onClick={clearSong}>
            <X />
          </ActionIcon>
          <ActionIcon size='xl' onClick={mute}>
            {volume === 0 ? <VolumeOff /> : <Volume />}
          </ActionIcon>
          <ActionIcon size='xl' onClick={play}>
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
            <ActionIcon size='xl'>
              <Download />
            </ActionIcon>
          </a>
          <ActionIcon size='xl' onClick={addLike}>
            {isLiked(document.querySelector("#songDetails div")!.innerHTML) ? <Heartbeat /> : <Heart />}
          </ActionIcon>
        </Group>
      </div >
    )
  }

  const FooterButton = ({ text, icon, link }: any) => {
    const [po, setPo] = useState(false)

    return (
      <Popover
        target={
          <Link prefetch href={link}>
            <ActionIcon onMouseLeave={() => { setPo(false) }} onMouseEnter={() => { setPo(true) }} size='xl'>
              {icon}
            </ActionIcon>
          </Link>
        }
        opened={po}
        onClose={() => { setPo(false) }}
        position="top"
        spacing='sm'
        shadow='xl'
        withArrow
      >
        <Text>{text}</Text>
      </Popover>
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
          <audio autoPlay onChange={() => { setLoading(true) }} onEnded={() => { setPaused(true) }} onPause={() => { setPaused(true) }} onPlay={() => { setPaused(false) }} onLoadStart={(e: any) => {
            if (e.target.src.startsWith(`${document.location.origin}/api/`)) {
              setLoading(true)
            }
          }
          } onLoadedData={(e: any) => {
            setLoading(false)
            addHistory()
          }} style={{ 'display': 'none' }} />
          <AppShell
            header={
              <Header height={60} p="xs">
                <Group sx={{ display: 'flex', alignItems: 'center', justifyContent: 'center' }} position='center' direction='row'>
                  <Title className='title' sx={{ fontFamily: 'Comfortaa, sans-serif' }} mb='sm'><Link href='/'>Ossia</Link></Title>
                </Group>
              </Header>
            }
            footer={
              <div style={{borderTop: '1px solid #2C2E33'}}>
                <Group spacing='sm' p='md' position="center" id='center'>
                  <FooterButton icon={<Home />} text="Home" link="/" />
                  <FooterButton icon={<Books />} text="Library" link="/library" />
                  <FooterButton icon={<PlayerPlay />} text="Player" link="/player" />
                </Group>
                <Space h='md' />
              </div>
            }>
            <Container p='sm'>
              <Component {...pageProps} />
              <Affix sx={{ padding: '.2rem .4rem', opacity: '.75' }}>
                <Text>{appInfo.shortName} {appInfo.version}</Text>
                {!dw && typeof window !== 'undefined' ? location.pathname !== '/player' ? <ActionIcon variant='outline' size='xl' m='sm' onClick={() => { setDw(!dw) }} sx={{ position: 'fixed', bottom: 0, left: 0, background: 'rgba(0,0,0,.5)' }}>
                  <PlayerPlay />
                </ActionIcon> : <></> : <></>}
              </Affix>
              <Drawer
                opened={dw}
                onClose={() => setDw(false)}
                padding="xl"
                size="xl"
              >
                <Player />
              </Drawer>
            </Container>
          </AppShell>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default MyApp
