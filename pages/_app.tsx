import '../styles/globals.css'
import type { AppProps } from 'next/app'
import {
  AppShell,
  Text,
  Burger,
  Center,
  Footer,
  Group,
  Header,
  LoadingOverlay,
  MantineProvider,
  MediaQuery,
  Navbar,
  Paper,
  Image,
} from '@mantine/core';
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications';
import { ReactNode, useEffect, useRef, useState } from 'react';
import Link from 'next/link'
import { Books, Login, PlayerPlay, Search, Settings } from "tabler-icons-react";
import { useManifest } from '../components/manifest'
import { interactive } from '../components/styles'
import { localized } from '../components/localization'
import { useCookies } from "react-cookie"
import { useMe } from '../components/auth';
import { useHotkeys, useLocalStorage } from '@mantine/hooks';
import { useKonamiCode } from '../components/konami';
import { usePlayer } from '../components/player';
import { apiCall } from '../components/api';

const NavLink = ({ link, icon, label }: { link: string, icon: ReactNode, label: ReactNode }) => {
  return (<Link href={link}>
    <Paper component='button' style={{ background: 'rgba(0,0,0,.2)' }} tabIndex={0} radius="lg" onClick={() => { window.dispatchEvent(new Event("ossia-nav-click")) }} sx={interactive} p='md' withBorder>
      <Group direction='row'>
        {icon}
        <Text>{label}</Text>
      </Group>
    </Paper>
  </Link>)
}

const AppHeader = ({ sidebar }: { sidebar: any }) => {
  return (<Header style={{ zIndex: '99 !important' }} height={70} p="md">
    <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
      <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
        <Burger
          title="Navigation"
          opened={sidebar[0]}
          onClick={() => sidebar[1]((o: boolean) => !o)}
          size="sm"
          mr="xl"
        />
      </MediaQuery>

      <Center>
        <Link href="/"><Group onClick={() => {
          window.dispatchEvent(new Event("ossia-title-click"))
        }} onMouseDown={(e: any) => { e.preventDefault() }} className='click'><Image alt='Ossia' src="/title.png" height={40} /></Group></Link>
      </Center>
    </div>
  </Header>)
}

const AppFooter = ({ manifest, sidebar }: { manifest: any, sidebar: any }) => {
  return (<Footer height={60} p="md">
    <Center>
      <Link href="/about">
        <Group onClick={() => { window.dispatchEvent(new Event("ossia-nav-click")); sidebar[1](false) }} sx={interactive}>
          <Text align='center'>{manifest?.short_name} {localized.appNameAppend}{manifest?.version ? ` v${manifest.version}` : ''}</Text>
        </Group>
      </Link>
    </Center>
  </Footer>)
}

const AppNavbar = ({ sidebar, me, player }: { sidebar: any, me: any, player: any }) => {
  return (<Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebar[0]} width={{ sm: 200, lg: 300 }}>
    <Group grow direction='column' spacing='sm'>
      <NavLink icon={<Search />} label={localized.navSearch} link="/" />
      {Object.keys(player.playerDisp).length && <NavLink label={localized.navPlayer} link="/player" icon={<PlayerPlay />} />}
      {!me ? <NavLink icon={<Login />} label={localized.login} link='/login' /> : <NavLink icon={<Books />} label={localized.navLibrary} link="/library" />}
      <NavLink icon={<Settings />} label={localized.settings} link="/settings" />
    </Group>
  </Navbar>)
}

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)
  const konami = useKonamiCode()
  const [volume, setVolume] = useLocalStorage({ key: 'music-volume', defaultValue: 90 })
  const sidebar = useState(false);
  const manifest = useManifest()
  const playerRef = useRef<null | HTMLAudioElement>(null)
  const me = useMe()
  const [prevVol, setPrevVol] = useLocalStorage({ key: 'music-prev-volume', defaultValue: volume })
  const player = usePlayer(playerRef)
  const [cookies, setCookies, removeCookies] = useCookies(["lang"])
  const bg = useRef<null | HTMLDivElement>(null)
  const gradient = "linear-gradient(90deg, rgba(158,93,185,1) 0%, rgba(129,67,156,1) 100%)"

  useEffect(() => {
    if (konami) {
      setLoading(true)
      apiCall("GET", "/api/piped/streams", { v: "dQw4w9WgXcQ" }).then(resp => {
        setLoading(false)
        player.play(resp)
      })
    }
  }, [konami])

  useEffect(() => {
    if (!cookies.lang) {
      setCookies("lang", localized.getInterfaceLanguage())
    } else {
      localized.setLanguage(cookies.lang)
    }
  }, [cookies.lang, setCookies])

  useEffect(() => {
    setLoading(false)
    if (typeof window !== 'undefined') {
      window.addEventListener("ossia-nav-click", () => { sidebar[1](false) })
    }
  }, [])

  useEffect(() => {
    bg.current!.style.background = Object.keys(player.playerDisp).length ? `url("${player.playerDisp.ALBUMART}")` : gradient
  }, [player.playerDisp, bg])

  useEffect(() => {
    if (playerRef.current === null) { return }
    playerRef.current!.volume = volume / 100
  }, [volume])

  useHotkeys([["space", () => { (player.paused[1] as any)(!player.paused[0]) }], ["m", () => {
    if (!volume) {
      setVolume(prevVol)
    } else {
      setPrevVol(volume)
      setVolume(0)
    }
  }]])

  pageProps = {
    ...pageProps,
    playerRef,
    loading: [loading, setLoading],
    manifest,
    me,
    volume: [volume, setVolume],
    player,
  }

  return (<>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={{
      focusRing: 'auto',
      defaultRadius: 'lg',
      white: "#F5F3F4",
      black: "#0B090A",
      colors: {
        "purple_plum": ['#9E5DB9', '#9650B4', '#8C48A9', '#81439C', '#773D8F', '#6C3882', '#613275', '#562D68', '#4B275B', '#41214E'],
      },
      primaryColor: "purple_plum",
      primaryShade: 2,
      fontFamily: "Sora",
      fontFamilyMonospace: "Inconsolata",
      dir: 'ltr',
      loader: 'bars',
      dateFormat: "YYYY/MM/DD",
      colorScheme: "dark",
    }}>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={<AppNavbar player={player} me={me} sidebar={sidebar} />}
        footer={<AppFooter sidebar={sidebar} manifest={manifest} />}
        header={<AppHeader sidebar={sidebar} />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <ModalsProvider>
          <NotificationsProvider>
            <Center className="background-glow" style={{ zIndex: 1, filter: 'blur(20rem)', position: 'fixed', left: 240, top: -600, height: 400 }}>
              <div ref={bg} className='bglow-1' style={{ background: gradient, transition: '4s', objectFit: 'fill', height: 600, width: '90vw' }} draggable={false} />
            </Center>
            <audio autoPlay ref={playerRef} id='ossia-main-player' style={{ display: 'none' }} />
            <LoadingOverlay visible={loading} sx={{ position: 'fixed' }} />
            <div style={{ zIndex: 2 }}>
              <Component {...pageProps} />
            </div>
          </NotificationsProvider>
        </ModalsProvider>
      </AppShell>
    </MantineProvider>
  </>)
}

export default MyApp
