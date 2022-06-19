import '../styles/globals.scss'
import { ColorScheme, ColorSchemeProvider, Group, MantineProvider, Title, Text, Affix, Burger, Paper, Transition, Collapse, Container, Divider, Box } from "@mantine/core";
import { useColorScheme, useHotkeys, useLocalStorage } from "@mantine/hooks";
import { AppProps } from "next/app";
import { useCallback, useEffect, useState } from "react";
import { AppShell, Header } from '@mantine/core';
import Link from 'next/link';
import { Home, PlayerPlay, Settings } from 'tabler-icons-react';
import { interactivePaper } from '../components';
import { ModalsProvider } from '@mantine/modals';
import { NotificationsProvider } from '@mantine/notifications';
import { Meta } from '../components';
import { useRouter } from 'next/router';
import * as gtag from "../lib/gtag";
const isProduction = process.env.NODE_ENV === "production";

export default function MyApp({ Component, pageProps }: AppProps) {
    const [volume, setVolume] = useLocalStorage<number>({ 'key': 'volume', 'defaultValue': 100 })
    const [colorScheme, setTheColorScheme] = useLocalStorage<ColorScheme>({ 'key': "color-scheme", 'defaultValue': 'dark' });
    const [lowQualityMode, setLowQualityMode] = useLocalStorage<number>({ 'key': 'low-quality-mode', 'defaultValue': 1 })
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({ 'key': 'current-low-quality-mode', 'defaultValue': false })
    const [connType, setConnType] = useLocalStorage({ 'key': 'connection-type', 'defaultValue': 'unknown' })
    const [manifest, setManifest] = useState<any>()
    const [navMode, setNavMode] = useState<boolean>(false)
    const [songDetails, setSongDetails] = useLocalStorage<object>({ 'key': 'song-details', 'defaultValue': {} })
    const [paused, setPaused] = useLocalStorage<boolean>({ 'key': 'paused', 'defaultValue': false })

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

    useEffect(() => {
        const player = document.querySelector("audio#mainPlayer") as any
        player.volume = volume / 100
    }, [volume])

    const setColorScheme = useCallback((value: any) => {
        if (typeof window === 'undefined') { return }
        setTheColorScheme(value)
        document.documentElement.setAttribute('data-theme', value)
    }, [setTheColorScheme])

    const toggleColorScheme = (value?: ColorScheme) => { setColorScheme(value || (colorScheme === 'dark' ? 'light' : 'dark')); }
    const clientColor = useColorScheme()

    useEffect(() => {
        switch (lowQualityMode) {
            case 0:
                setCurrentLQ(false)
                break
            case 2:
                setCurrentLQ(true)
                break
            case 1:
                switch (connType) {
                    case 'cellular':
                        setCurrentLQ(true)
                        break
                    default:
                        setCurrentLQ(false)
                        break
                }
                break
        }
    }, [lowQualityMode, setCurrentLQ, connType])

    useEffect(() => { // Set color scheme as html attribute
        if (typeof window !== 'undefined' && !colorScheme) {
            setColorScheme(clientColor)
        }
    }, [setColorScheme, clientColor, colorScheme])

    useEffect(() => { // Get Manifest
        if (!manifest && typeof window !== 'undefined') {
            fetch(`${location.origin}/api/manifest.webmanifest`).then(async resp => {
                setManifest(await resp.json())
            })
        }
    }, [manifest])

    useEffect(() => {
        if (typeof window === 'undefined') return;
        const player = document.querySelector('audio#mainPlayer') as HTMLAudioElement
        if (paused) {
            player.pause()
            document.documentElement.setAttribute('music-playing', 'false')
        } else {
            player.play()
            document.documentElement.setAttribute('music-playing', 'true')
        }
    }, [paused])

    if (typeof window !== 'undefined') {
        navigator.connection.addEventListener('typechange', function () {
            setConnType(navigator.connection.type);
        });
    }

    useHotkeys([['ctrl+J', () => { toggleColorScheme() }], ['space', () => { setPaused(!paused) }]])

    const AppHeader = () => {
        return (
            <Header style={{ position: 'relative' }} height={60} p="xs">
                <Burger style={{ position: 'absolute', top: 0, left: 0 }} className='navBurger' mx='sm' my={10} size={30} opened={navMode} onClick={() => { setNavMode(!navMode) }} />
                <Group position='center'><Title className='link' align='center' sx={{ fontFamily: 'Comfortaa; cursive' }}><Link href='/'>Ossia</Link></Title></Group>
            </Header>
        )
    }

    const AppFooter = () => {
        return (
            <Group p='sm' position='center'>
                <Text sx={{ display: manifest ? 'block' : 'none' }} size='xs'>{manifest?.name} v{manifest?.version}</Text>
            </Group>
        )
    }

    const Nav = ({ styles }: any) => {
        const Page = ({ icon, text, link }: any) => {
            return (
                <Link href={link}>
                    <Paper sx={interactivePaper} onClick={() => { setNavMode(false) }} className="pagePaper" p='md' shadow='lg' withBorder>
                        <Group>
                            {icon}
                            <Text>{text}</Text>
                        </Group>
                    </Paper>
                </Link>
            )
        }
        return (<Group sx={styles} direction='column' grow spacing='sm'>
            <Text size='lg'>Navigation</Text>
            <Page icon={<Home />} text="Home" link="/" />
            <Page icon={<Settings />} text="Settings" link="/settings" />
            <Page icon={<PlayerPlay />} text="Player" link="/player" />
        </Group>)
    }

    return (<>
        <Meta pageTitle="Ossia" title="Ossia Music Player" description={manifest?.description} image="/img/preview.png">
            <meta name='keywords' content="ossia, ossia music, ossia music player, ossia.ml, shie1, free to use youtube client, music, music player, last.fm, last.fm player" />
            <meta property="og:url" content={typeof window !== 'undefined' ? location.href : 'https://ossia.ml'} />
            <link rel="canonical" href={typeof window !== 'undefined' ? location.href : 'https://ossia.ml'} />0
        </Meta>
        <audio style={{ display: 'none' }} autoPlay={true} id='mainPlayer' onEnded={() => { setPaused(true) }} onPause={() => { setPaused(true) }} onPlay={() => { setPaused(false) }} />
        <ColorSchemeProvider colorScheme={colorScheme} toggleColorScheme={toggleColorScheme}>
            <MantineProvider withGlobalStyles withNormalizeCSS theme={{
                focusRing: 'auto',
                defaultRadius: 'md',
                white: "#F5F3F4",
                black: "#0B090A",
                colors: {
                    "red": ['#A4161A', '#961419', '#8A1317', '#7F1115', '#731013', '#680E11', '#5C0D0F', '#510B0D', '#45090B', '#3A080A'],
                    "indigo": ['#590288', '#53027E', '#4C0274', '#46026B', '#3F0161', '#390157', '#33014E', '#2C0144', '#26013A', '#200130'],
                    "purple_plum": ['#9E5DB9', '#9650B4', '#8C48A9', '#81439C', '#773D8F', '#6C3882', '#613275', '#562D68', '#4B275B', '#41214E'],
                    "light": ['#FFFFFF', '#EDEDED', '#DBDBDB', '#C8C8C8', '#B6B6B6', '#A4A4A4', '#929292', '#808080', '#6D6D6D', '#5B5B5B']
                },
                primaryColor: "purple_plum",
                primaryShade: 0,
                fontFamily: "Sora",
                fontFamilyMonospace: "Inconsolata",
                dir: 'ltr',
                loader: 'bars',
                dateFormat: "YYYY/MM/DD",
                colorScheme: colorScheme
            }}>
                <ModalsProvider>
                    <NotificationsProvider>
                        <AppShell
                            padding="md"
                            header={<AppHeader />}
                            footer={<AppFooter />}
                            styles={(theme) => ({
                                main: {
                                    backgroundColor: theme.colorScheme === 'dark' ? theme.colors.dark[5] : theme.colors.light[1],
                                },
                            })}
                        >
                            <Collapse in={navMode}>
                                <Container>
                                    <Nav />
                                    <Divider my='xl' size="xl" />
                                </Container>
                            </Collapse>
                            <Component {...pageProps} />
                        </AppShell>
                    </NotificationsProvider>
                </ModalsProvider>
            </MantineProvider>
        </ColorSchemeProvider>
    </>)
}