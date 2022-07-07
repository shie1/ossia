import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppShell, Text, Burger, Center, Footer, Group, Header, LoadingOverlay, MantineProvider, MediaQuery, Navbar, Paper, Title } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { useEventListener } from "@mantine/hooks"
import { useEffect, useRef, useState } from 'react'
import Link from 'next/link'
import { Books, BrandLastfm, Home, InfoCircle, PlayerPlay, Search, Settings } from "tabler-icons-react"
import { useManifest } from '../components/manifest'
import { interactive } from '../components/styles'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { usePlayer } from '../components/player'
import { localized } from '../components/localization'
import { useCookies } from "react-cookie"
import theme from '../components/theme'
import { wip } from '../components/notifications'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)
  const [playerContent, setPlayerContent] = useLocalStorage<any>({ 'key': 'player-content', 'defaultValue': {} })
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streamDetails, setStreamDetails] = useLocalStorage({ 'key': 'stream-details', 'defaultValue': {} })
  const manifest = useManifest()
  const player = usePlayer()
  const playerRef = useRef<HTMLAudioElement | null>(null)
  useLocalStorage<Array<string>>({ 'key': 'playlists', 'defaultValue': [] })
  const [volume, setVolume] = useLocalStorage<number>({ 'key': 'volume', 'defaultValue': 90 })
  const [cookies, setCookies, removeCookies] = useCookies(["lang", "auth"])
  useEffect(() => {
    if (!cookies.lang) {
      setCookies("lang", localized.getInterfaceLanguage())
    } else {
      localized.setLanguage(cookies.lang)
    }
  }, [cookies.lang, setCookies])

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((document.querySelector("audio#ossia-main-player") as HTMLAudioElement).src == '') {
        setStreamDetails({})
        setPlayerContent({})
      }
    }
  }, [setStreamDetails, setPlayerContent])

  useEffect(() => {
    playerRef.current!.volume = volume / 100
  }, [volume])

  setInterval(() => {
    if (typeof window !== 'undefined' && document.documentElement.hasAttribute('data-loading')) {
      const dat = JSON.parse((document.documentElement.getAttribute('data-loading') as "true" | "false"))
      if (dat != loading) {
        setLoading(dat)
      }
    }
  }, 200)

  useHotkeys([["space", () => { player.toggleState() }]])

  const NavLink = ({ link, icon, label }: any) => {
    return (<Link href={link}>
      <Paper component='button' style={{ background: 'rgba(0,0,0,.2)' }} tabIndex={0} radius="lg" onClick={() => { if (link === "") { wip() }; setSidebarOpen(false); window.dispatchEvent(new Event("ossia-nav-click")) }} sx={interactive} p='md' withBorder>
        <Group direction='row'>
          {icon}
          <Text>{label}</Text>
        </Group>
      </Paper>
    </Link>)
  }

  const AppHeader = () => {
    return (<Header height={70} p="md">
      <div style={{ display: 'flex', alignItems: 'center', height: '100%' }}>
        <MediaQuery largerThan="sm" styles={{ display: 'none' }}>
          <Burger
            title="Navigation"
            opened={sidebarOpen}
            onClick={() => setSidebarOpen((o) => !o)}
            size="sm"
            mr="xl"
          />
        </MediaQuery>

        <Center>
          <Link href="/"><Title onClick={() => {
            window.dispatchEvent(new Event("ossia-title-click"))
          }} onMouseDown={(e) => { e.preventDefault() }} className='click'>{manifest?.short_name}</Title></Link>
        </Center>
      </div>
    </Header>)
  }

  const AppFooter = () => {
    return (<Footer height={60} p="md">
      <Center>
        <Link href="/about">
          <Group onClick={() => { window.dispatchEvent(new Event("ossia-nav-click")); setSidebarOpen(false) }} sx={interactive}>
            <Text align='center'>{manifest?.short_name} {localized.appNameAppend}{manifest?.version ? ` v${manifest.version}` : ''}</Text>
          </Group>
        </Link>
      </Center>
    </Footer>)
  }

  const AppNavbar = () => {
    return (<Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebarOpen} width={{ sm: 200, lg: 300 }}>
      <Group grow direction='column' spacing='sm'>
        <NavLink icon={<Search />} label={localized.navSearch} link="/" />
        {Object.keys(streamDetails).length !== 0 && <NavLink icon={<PlayerPlay />} label={localized.navPlayer} link="/player" />}
        <NavLink icon={<Books />} label={localized.navLibrary} link="" />
        {cookies.auth && <NavLink icon={<BrandLastfm />} label="Last.FM" link="/user" />}
        <NavLink icon={<Settings />} label={localized.settings} link="/settings" />
      </Group>
    </Navbar>)
  }

  return (<>
    <MantineProvider withGlobalStyles withNormalizeCSS theme={theme}>
      <AppShell
        navbarOffsetBreakpoint="sm"
        asideOffsetBreakpoint="sm"
        fixed
        navbar={<AppNavbar />}
        footer={<AppFooter />}
        header={<AppHeader />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <ModalsProvider>
          <NotificationsProvider>
            <LoadingOverlay visible={loading} sx={{ position: 'fixed' }} />
            <audio onPause={() => { player.setPaused(true) }} onPlay={() => { player.setPaused(false) }} onWaiting={() => { player.setPaused(true); document.documentElement.setAttribute('data-loading', 'true') }} ref={playerRef} autoPlay id='ossia-main-player' onLoadStart={(e) => {
              if (!e.currentTarget.src.startsWith(document.location.origin)) document.documentElement.setAttribute('data-loading', 'true')
            }} onLoadedData={() => { document.documentElement.setAttribute('data-loading', 'false') }} />
            <div>
              <Center className="background-glow" style={{ filter: 'blur(15rem)', position: 'fixed', left: 240, top: -480, height: '10rem' }}>
                <div style={{ background: `url(${playerContent?.cover}`, objectFit: 'fill', height: '50vh', width: '90vw' }} draggable={false} />
              </Center>
              <Component {...pageProps} />
            </div>
          </NotificationsProvider>
        </ModalsProvider>
      </AppShell>
    </MantineProvider>
  </>)
}

export default MyApp
