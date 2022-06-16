import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { Affix, Header, MantineProvider, Modal, Text, Title, Container, Space, LoadingOverlay, Drawer, ActionIcon, Image, SegmentedControl, InputWrapper, Slider, Group, AppShell, Navbar, Popover, AspectRatio, ScrollArea, Paper, Anchor } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider, showNotification } from '@mantine/notifications'
import { useEffect, useState } from 'react';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import Link from 'next/link';
import { BrandYoutube, PlayerPause, PlayerPlay, Volume, VolumeOff, Download, Books, Home, Heart, Heartbeat, X, Menu2, RepeatOff, RepeatOnce, Settings, BrandLastfm, Playlist } from 'tabler-icons-react'
import { useRouter } from 'next/router';
import * as gtag from "../lib/gtag";
import { htmlDecode } from '../functions';
const isProduction = process.env.NODE_ENV === "production";

function MyApp({ Component, pageProps }: AppProps, props: any) {
  const [volume, setVolume] = useLocalStorage({
    key: 'volume', defaultValue: 100
  })
  const [loop, setLoop] = useLocalStorage({
    key: 'loop', defaultValue: true
  })
  const [connectionType, setCT] = useLocalStorage({
    'key': 'connectionType', 'defaultValue': 'wifi'
  })
  const [lqmode, setLQMode] = useLocalStorage({
    'key': 'lowQualityMode',
    'defaultValue': 1
  })
  const [logged, setLogged] = useLocalStorage({
    'key': 'logged', 'defaultValue': false
  })
  const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
    'key': 'currentLQ', 'defaultValue': false
  })
  const [paused, setPaused] = useLocalStorage(
    { key: 'paused', defaultValue: true }
  )
  const [liked, setLiked] = useLocalStorage<Array<any>>(
    { key: 'liked-songs', defaultValue: [] }
  );
  const [history, setHistory] = useLocalStorage<Array<any>>(
    { key: 'history', defaultValue: [] }
  );
  const [scrobbleF, setScrobble] = useLocalStorage({
    'key': 'scrobble', 'defaultValue': true
  })
  const [loading, setLoading] = useState<boolean>(false)
  const [dw, setDw] = useState(false)
  const [prevVol, setPrevVol] = useState(100)
  const [appInfo, setAppInfo] = useState<any>(false)

  const router = useRouter()

  useEffect(() => {
    const handleRouteChange = (url: URL) => {
      if (isProduction) gtag.pageview(url);
    };
    router.events.on("routeChangeComplete", handleRouteChange);
    return () => {
      router.events.off("routeChangeComplete", handleRouteChange);
    };
  }, [router.events]);

  if (typeof window !== 'undefined') {
    navigator.connection.addEventListener('typechange', function () {
      setCT(navigator.connection.type);
    });
  }

  useEffect(() => {
    switch (lqmode) {
      case 0:
        setCurrentLQ(false)
        break
      case 2:
        setCurrentLQ(true)
        break
      case 1:
        switch (connectionType) {
          case 'cellular':
            setCurrentLQ(true)
            break
          default:
            setCurrentLQ(false)
            break
        }
        break
    }
  }, [lqmode, setCurrentLQ, connectionType])

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

  useEffect(() => {
    if (typeof window !== 'undefined') {
      document.getElementsByTagName('audio')[0].loop = loop
    }
  }, [loop])

  const clearSong = () => {
    const audioE = document.querySelector('audio') as HTMLAudioElement
    audioE.src = ''
    const detailsE = document.querySelector('#songDetails') as HTMLDivElement
    detailsE.querySelector('h1')!.innerHTML = ''
    detailsE.querySelector('h2')!.innerHTML = ''
    detailsE.querySelector('div#id')!.innerHTML = ''
    detailsE.querySelector('section#json')!.innerHTML = ''
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

    const id = document.querySelector("#songDetails div#id")!.innerHTML
    if (isLiked(id)) {
      setLiked(take(liked, id));
    } else {
      setLiked(oldArray => [song, ...oldArray]);
    }
  }

  const addHistory = () => {
    const song = {
      'id': document.querySelector("#songDetails div#id")?.innerHTML,
      'title': document.querySelector("#songDetails h1")?.innerHTML,
      'thumbnail': document.querySelector("#songDetails span")?.innerHTML,
      'added': (new Date()).toUTCString()
    }

    const id = document.querySelector("#songDetails div#id")!.innerHTML
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

  const scrobble = async () => {
    if (typeof window === 'undefined') { return }
    const videoTitle = htmlDecode(document?.querySelector("#songDetails h1")!.innerHTML)!.replace(/(\(.*\))|(【.*】)|(\[.*\])|({.*})/g, '')
    const videoAuthor = htmlDecode(document?.querySelector("#songDetails h2")!.innerHTML!)
    const videoDescription = document?.querySelector("#songDetails p")!.innerHTML
    let title
    let artist
    if (videoDescription?.startsWith("Provided to YouTube") && videoDescription?.endsWith("Auto-generated by YouTube.")) {
      const descLines = videoDescription.split('<br>')
      title = htmlDecode(descLines[4])!.replace(/(\(.*\))|(【.*】)|(\[.*\])|({.*})/g, '')
      artist = videoAuthor?.split(" - ")[0]
    }else{
      title = videoTitle?.split(' - ')[1]
      artist = videoTitle?.split(' - ')[0]
    }
    let data
    console.log(title,artist)
    if (title) {
      data = await (await fetch(`${document.location.origin}/api/lastfm/search`, { method: 'POST', body: JSON.stringify({ 'track': title, ...(artist ? { 'artist': artist } : {}) }) })).json()
      if(data.lfm.results[0]["opensearch:totalResults"][0] == 0){return}
      const songData = data.lfm.results[0].trackmatches[0].track[0]
      showNotification({
        'title': "Song recognized!",
        'message': `${songData.artist} - ${songData.name}`,
        'icon': <BrandLastfm />,
        'color': 'red'
      })
      document.querySelector('#songDetails h1')!.innerHTML = songData.name
      document.querySelector('#songDetails h2')!.innerHTML = songData.artist
      if(!scrobbleF || !logged){return}
      fetch(`${document.location.origin}/api/lastfm/scrobble`, { 'method': 'POST', body: JSON.stringify({ 'track': songData.name[0], 'artist': songData.artist[0] }) })
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
          <a href={`https://youtu.be/${document?.querySelector("#songDetails div#id")?.innerHTML}`} target='_blank' rel="noreferrer">
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
          <ActionIcon size='xl' onClick={() => { setLoop(!loop) }}>
            {loop ? <RepeatOnce /> : <RepeatOff />}
          </ActionIcon>
          <ActionIcon size='xl' onClick={play}>
            {paused ? <PlayerPlay /> : <PlayerPause />}
          </ActionIcon>
          <a href={`${document?.location.origin}/api/stream?v=${document?.querySelector("#songDetails div#id")?.innerHTML}`} className='nodim' id='download' onClick={() => {
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
            {isLiked(document.querySelector("#songDetails div#id")!.innerHTML) ? <Heartbeat /> : <Heart />}
          </ActionIcon>
        </Group>
        <InputWrapper label="Volume">
          <Group position='center'>
            <SegmentedControl transitionDuration={0} value={volume.toString()} onChange={val => { setVolume(Number(val)) }}
              data={[
                { label: 'Muted', value: '0' },
                { label: 'Low', value: '25' },
                { label: 'Medium', value: '50' },
                { label: 'High', value: '75' },
                { label: 'Max', value: '100' },
              ]}
            />
          </Group>
        </InputWrapper>
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

  const Menu = () => {
    const MenuLink = ({ icon, link, text }: any) => {
      return (
        <Link href={link}>
          <Paper onClick={(e: any) => { setDw(false) }} sx={{ width: '100%' }} withBorder p='sm' className='menuLink'>
            <Group direction='row'>
              {icon}
              <Text size='md'>{text}</Text>
            </Group>
          </Paper>
        </Link>
      )
    }
    return (
      <Group spacing='sm' direction='column'>
        <MenuLink icon={<Home />} link="/" text="Home" />
        <MenuLink icon={<Books />} link="/library" text="Library" />
        <MenuLink icon={<PlayerPlay />} link="/player" text="Player" />
        <MenuLink icon={<BrandLastfm />} link="/user?" text="Last.fm" />
        <MenuLink icon={<Settings />} link="/settings" text="Settings" />
      </Group>
    )
  }

  return (
    <MantineProvider theme={{ colorScheme: 'dark' }} withGlobalStyles withNormalizeCSS>
      <ModalsProvider>
        <NotificationsProvider>
          <div style={{ display: 'none' }} id='songDetails'>
            <h1 id='title' /><h2 id='author' /><div id='id' /><span id='thumbnail' /><p id='description' /><section id='json' />
          </div>
          <LoadingOverlay sx={{ position: "fixed" }} visible={loading} />
          <audio autoPlay onChange={() => { setLoading(true) }} onEnded={() => { setPaused(true) }} onPause={() => { setPaused(true) }} onPlay={() => { setPaused(false) }} onLoadStart={(e: any) => {
            if (e.target.src.startsWith(`${document.location.origin}/api/`)) {
              setLoading(true)
            }
          }
          } onLoadedData={(e: any) => {
            scrobble()
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
              <div style={{ borderTop: '1px solid #2C2E33' }}>
                <Group spacing='sm' p='md' position="center" id='center'>
                  <Text align='center'>{appInfo.fullName} v{appInfo.version}<br />built and maintained <Anchor target='_blank' href='https://github.com/shie1'>Shie1bi</Anchor></Text>
                </Group>
                <Space h='md' />
              </div>
            }>
            <Container p='sm'>
              <Component {...pageProps} />
              <Affix sx={{ padding: '.2rem .4rem', opacity: '.75' }}>
                {!dw ? <ActionIcon variant='outline' size='xl' m='sm' onClick={() => { setDw(!dw) }} sx={{ position: 'fixed', bottom: 0, left: 0, background: 'rgba(0,0,0,.5)' }}>
                  <Menu2 />
                </ActionIcon> : <></>}
              </Affix>
              <Drawer
                opened={dw}
                onClose={() => setDw(false)}
                padding="xl"
                size="xl"
                title="Navigation"
              >
                <Menu />
              </Drawer>
            </Container>
          </AppShell>
        </NotificationsProvider>
      </ModalsProvider>
    </MantineProvider>
  )
}

export default MyApp
