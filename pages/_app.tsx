import '../styles/globals.css'
import type { AppProps } from 'next/app'
import { AppShell, Text, Burger, Center, Footer, Group, Header, LoadingOverlay, MantineProvider, MediaQuery, Navbar, Paper, Title, Avatar, Image } from '@mantine/core'
import { ModalsProvider } from '@mantine/modals'
import { NotificationsProvider } from '@mantine/notifications';
import { ReactNode, useEffect, useState } from 'react';
import Link from 'next/link'
import { Books, Login, Search, Settings } from "tabler-icons-react";
import { useManifest } from '../components/manifest'
import { interactive } from '../components/styles'
import { localized } from '../components/localization'
import { useCookies } from "react-cookie"
import { useRouter } from 'next/router'
import { useMe } from '../components/auth';
import { useLocalStorage } from '@mantine/hooks';

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

const AppHeader = ({ manifest, sidebar }: { manifest: any, sidebar: any }) => {
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
        }} onMouseDown={(e: any) => { e.preventDefault() }} className='click'><Image src="/title.png" height={40} /></Group></Link>
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

const AppNavbar = ({ cookies, sidebar }: { cookies: any, sidebar: any }) => {
  const me = useMe()
  return (<Navbar p="md" hiddenBreakpoint="sm" hidden={!sidebar[0]} width={{ sm: 200, lg: 300 }}>
    <Group grow direction='column' spacing='sm'>
      <NavLink icon={<Search />} label={localized.navSearch} link="/" />
      {!me ? <NavLink icon={<Login />} label="Login" link='/login' /> : <NavLink icon={<Books />} label={localized.navLibrary} link="/library" />}
      <NavLink icon={<Settings />} label={localized.settings} link="/settings" />
    </Group>
  </Navbar>)
}

function MyApp({ Component, pageProps }: AppProps) {
  const [loading, setLoading] = useLocalStorage({ key: "loading", defaultValue: false })
  const sidebar = useState(false);
  const manifest = useManifest()
  const router = useRouter()
  const [cookies, setCookies, removeCookies] = useCookies(["lang"])
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
        navbar={<AppNavbar sidebar={sidebar} cookies={cookies} />}
        footer={<AppFooter sidebar={sidebar} manifest={manifest} />}
        header={<AppHeader sidebar={sidebar} manifest={manifest} />}
        styles={(theme) => ({
          main: { backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[8] : theme.colors.gray[0] },
        })}
      >
        <ModalsProvider>
          <NotificationsProvider>
            <audio id='ossia-main-player' style={{ display: 'none' }} />
            <LoadingOverlay visible={loading} sx={{ position: 'fixed' }} />
            <Component {...pageProps} />
          </NotificationsProvider>
        </ModalsProvider>
      </AppShell>
    </MantineProvider>
  </>)
}

export default MyApp
