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
import { useHotkeys, useLocalStorage, useMediaQuery } from '@mantine/hooks';
import { useKonamiCode } from '../components/konami';
import { usePlayer } from '../components/player';
import { apiCall } from '../components/api';
import { useUserAgent } from '../components/useragent';
import { Alert } from '../components/alert';
import { useRouter } from 'next/router';
import { Icon } from '../components/icons';

const NavLink = ({ link, icon, label, onClick }: { link?: string, icon: ReactNode, label: ReactNode, onClick?: Function }) => {
  return (<Link href={link || "#"}>
    <Paper component='button' style={{ background: 'rgba(0,0,0,.2)' }} tabIndex={0} radius="lg" onClick={() => { window.dispatchEvent(new Event("ossia-nav-click")); if (onClick) { onClick() } }} sx={interactive} p='md' withBorder>
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
        }} onMouseDown={(e: any) => { e.preventDefault() }} className='click'><Image alt='Ossia' src="/api/img/title.png" height={40} /></Group></Link>
      </Center>
    </div>
  </Header>)
}

const AppFooter = ({ manifest, sidebar }: { manifest: any, sidebar: any }) => {
  return (<Footer height={60} p="md">
    <Center>
      <Link href="/about">
        <Group onClick={() => { window.dispatchEvent(new Event("ossia-nav-click")); sidebar[1](false) }} sx={interactive}>
          <Text align='center'>{manifest?.short_name} {localized.appNameAppend}{manifest?.version ? ` v${manifest.version}` : ''} (BETA)</Text>
        </Group>
      </Link>
    </Center>
  </Footer>)
}

const AppNavbar = ({ sidebar, me, player, install }: { sidebar: any, me: any, player: any, install: any }) => {
  const router = useRouter()

  const links = [
    ["Search", localized.navSearch, "/"],
    ["PlayerPlay", localized.navPlayer, "/player"],
    !me ? ["Login", localized.login, "/login"] : ["Books", localized.navLibrary, "/library"],
    ["Settings", localized.settings, "/settings"]
  ]

  if (!Object.keys(player.playerDisp).length) { links.splice(1, 1) }

  return (<Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebar[0]} width={{ sm: 200, lg: 300 }}>
    <Group grow direction='column' spacing='sm'>
      {links.map((link: any, i) => {
        return <NavLink key={i} link={link[2]} icon={<Icon icon={link[0]} />} label={link[1]} />
      })}
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
  const mg = useRef<null | HTMLAudioElement>(null)
  const me = useMe()
  const [install, setInstall] = useState<any>(null)
  const router = useRouter()
  const touchScreen = useMediaQuery("(pointer: coarse)")
  const [prevVol, setPrevVol] = useLocalStorage({ key: 'music-prev-volume', defaultValue: volume })
  const player = usePlayer(playerRef)
  const [cookies, setCookies, removeCookies] = useCookies(["lang"])
  const bg = useRef<null | HTMLDivElement>(null)
  const gradient = "linear-gradient(90deg, rgba(158,93,185,1) 0%, rgba(129,67,156,1) 100%)"
  const userAgent = useUserAgent()
  const [playlists, setPlaylists] = useState<Array<any> | null>(null)

  useEffect(() => {
    apiCall("GET", "/api/user/playlists", {}).then(resp => {
      setPlaylists(resp)
    })
  }, [router])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      window.addEventListener("ossia-playlist-added", () => {
        apiCall("GET", "/api/user/playlists", {}).then(resp => {
          setPlaylists(resp)
        })
      })
      window.addEventListener("beforeinstallprompt", async (e: any) => {
        setInstall(e)
        const { outcome } = await e.userChoice;
        if (outcome === "accepted") {
          setInstall(null)
        }
      })
      window.addEventListener("ossia-nav-click", () => { sidebar[1](false) })
    }
  }, [])

  useEffect(() => {
    if (konami) {
      if (playerRef.current?.paused) playerRef.current?.pause()
      mg.current!.volume = volume / 100
      mg.current?.play()
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
    bg.current!.style.background = player.playerDisp.ALBUMART ? `url("${player.playerDisp.ALBUMART}")` : gradient
  }, [player.playerDisp, bg])

  useEffect(() => {
    if (playerRef.current === null) { return }
    playerRef.current!.volume = volume / 100
  }, [volume])

  useHotkeys([
    ["space", () => { (player.paused[1] as any)(!player.paused[0]) }],
    ["m", () => {
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
    touchScreen,
    userAgent,
    playlists,
    install,
    installed: install === null,
  }

  return (<div onContextMenu={(e) => { e.preventDefault() }}>
    {konami && <Center style={{ width: '100vw', height: '100vh', position: 'fixed', top: 0, left: 0, zIndex: '99 !important', background: 'black' }}>
      <audio autoPlay ref={mg} src='/audio/mind_games.mp3' />
      <p style={{ fontSize: '50vmin' }}>🏅</p>
    </Center>}
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
        style={{ display: konami ? 'none' : '' }}
        navbar={<AppNavbar install={install} player={player} me={me} sidebar={sidebar} />}
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
            <audio
              onLoadStart={(e) => { if (!e.currentTarget.src.startsWith(document.location.origin)) setLoading(true) }} onLoad={() => { setLoading(false) }}
              onWaiting={() => { setLoading(true) }}
              onCanPlay={() => { setLoading(false) }}
              autoPlay ref={playerRef} id='ossia-main-player' style={{ display: 'none' }} />
            <LoadingOverlay visible={loading} sx={{ position: 'fixed' }} />
            <div style={{ zIndex: 2 }}>
              <noscript>
                <img alt='Megamind' style={{ position: 'fixed', top: 0, left: 0, width: '100vw', height: '100vh' }} src='/api/img/nojs.jpg' />
                <div style={{ position: 'fixed', justifyContent: 'center', alignItems: 'center', top: 0, left: 0, padding: 0, margin: 0, display: 'flex', width: '100vw', height: '100vh', zIndex: '99 !important' }}>
                  <audio controlsList="nodownload noplaybackrate novolume" loop controls autoPlay src='/audio/mii_channel.mp3' />
                </div>
              </noscript>
              {userAgent?.os.name === "iOS" && <Alert title={localized.iosTitle!} text={localized.iosText!} />}
              <Component {...pageProps} />
            </div>
          </NotificationsProvider>
        </ModalsProvider>
      </AppShell>
    </MantineProvider>
  </div>)
}

export default MyApp
