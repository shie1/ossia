import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppShell, Text, Burger, Center, Footer, Group, Header, LoadingOverlay, MantineProvider, MediaQuery, Navbar, Paper, Title } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications'
import { useEffect, useState } from 'react'
import Link from 'next/link'
import { Books, Home, PlayerPlay, Search } from "tabler-icons-react"
import { useManifest } from '../components/manifest'
import { interactive } from '../components/styles'
import { useHotkeys, useLocalStorage } from '@mantine/hooks'
import { usePlayer } from '../components/player'

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useState(false)
  const [sidebarOpen, setSidebarOpen] = useState(false);
  const [streamDetails, setStreamDetails] = useLocalStorage({ 'key': 'stream-details', 'defaultValue': {} })
  const manifest = useManifest()
  const player = usePlayer()

  useEffect(() => {
    if (typeof window !== 'undefined') {
      if ((document.querySelector("audio#ossia-main-player") as HTMLAudioElement).src == '') {
        setStreamDetails({})
      }
    }
  }, [setStreamDetails])

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
      <Paper component='button' style={{background: 'rgba(0,0,0,.2)'}} tabIndex={0} radius="lg" onClick={() => { setSidebarOpen(false) }} sx={interactive} p='md' withBorder>
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
          <Link href="/"><Title className='click'>{manifest?.short_name}</Title></Link>
        </Center>
      </div>
    </Header>)
  }

  const AppFooter = () => {
    return (<Footer height={60} p="md">
      <Center>
        <Text>{manifest?.name}{manifest?.version ? ` v${manifest.version}` : ''}</Text>
      </Center>
    </Footer>)
  }

  const AppNavbar = () => {
    return (<Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebarOpen} width={{ sm: 200, lg: 300 }}>
      <Group grow direction='column' spacing='sm'>
        <NavLink icon={<Search />} label="Search" link="/" />
        {Object.keys(streamDetails).length !== 0 && <NavLink icon={<PlayerPlay />} label="Player" link="/player" />}
        <NavLink icon={<Books />} label="Library" link="/library" />
      </Group>
    </Navbar>)
  }

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
      },
      primaryColor: "purple_plum",
      primaryShade: 0,
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
            <audio autoPlay id='ossia-main-player' onLoadStart={() => { document.documentElement.setAttribute('data-loading', 'true') }} onLoadedData={() => { document.documentElement.setAttribute('data-loading', 'false') }} />
            <Component {...pageProps} />
          </NotificationsProvider>
        </ModalsProvider>
      </AppShell>
    </MantineProvider>
  </>)
}

export default MyApp
