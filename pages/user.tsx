import { Accordion, AccordionItem, ActionIcon, Anchor, Avatar, Badge, Container, Grid, Group, Pagination, Paper, Table, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { BrandLastfm, Calendar, Clock, Friends as FriendsIcon, History, Microphone, Music, PlayerPlay, Trophy } from 'tabler-icons-react'
import { getCookie } from 'cookies-next'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { useLoading } from '../components/loading'
import { interactive } from '../components/styles'
import { LFMSong } from '../components/lastfm'

const LastFM: NextPage = (props: any) => {
    const [user, setUser] = useState<any>(false)
    const [friends, setFriends] = useState<Array<any>>([])
    const [recents, setRecents] = useState<Array<any>>([])
    const [toptracks, setTopTracks] = useState<Array<any>>([])
    const loading = useLoading()

    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            loading.start()
            const user = (new URLSearchParams(location.search)).get("u")
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getInfo', ...(user ? { 'user': user } : { 'user': props.auth.lfm.session[0].name[0] }) }) }).then(async (resp: any) => {
                setUser((await resp.json()).lfm.user[0])
                loading.stop()
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [props.auth, user])

    const router = useRouter()

    const clearUser = () => {
        setTimeout(() => {
            setUser(false)
            setFriends([])
            setRecents([])
        }, 500)
    }

    useEffect(() => {
        if (user && typeof window !== 'undefined' && friends.length == 0) {
            loading.start()
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getFriends', 'user': user?.name }) }).then(async (resp: any) => {
                const json = await resp.json()
                loading.stop()
                if (json.lfm.error) {
                    setFriends([false])
                } else {
                    setFriends(json.lfm.friends[0].user)
                }
            })
        }
    // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [user, friends])

    useEffect(() => {
        if (user && typeof window !== 'undefined' && recents.length == 0) {
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getRecentTracks', 'user': user?.name, 'limit': 50 }) }).then(async (resp: any) => {
                const json = await resp.json()
                if (json.lfm.error) {
                    setRecents([false])
                } else {
                    setRecents(json.lfm.recenttracks[0].track)
                }
            })
        }
    }, [user, recents])

    useEffect(() => {
        if (user && typeof window !== 'undefined' && toptracks.length == 0) {
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getTopTracks', 'user': user?.name, 'limit': 25 }) }).then(async (resp: any) => {
                const json = await resp.json()
                if (json.lfm.error) {
                    setTopTracks([false])
                } else {
                    setTopTracks(json.lfm.toptracks[0].track)
                }
            })
        }
    }, [user, toptracks])

    if (!props.auth && typeof window !== 'undefined') {
        if (!location.search) {
            const redir = "http://www.last.fm/api/auth/?api_key=070545b595db2dbcacbf07297c2e93e1"
            return (
                <>
                    <meta httpEquiv="refresh" content={`5;URL='${redir}'`} />
                    <Text mb={2} size='xl' align='center'>You will be redirected...</Text>
                    <Text size='md' align='center'>If this doesn&apos;t happen automatically, <Anchor href={redir}>click here!</Anchor></Text>
                </>
            )
        }
    }

    const Friends = () => {
        if (friends[0] === false) {
            return (
                <Text align='center'>Forever alone...</Text>
            )
        }
        const Friend = ({ friend }: any) => {
            return (
                <Grid.Col span={2}>
                    <Link href={`?u=${friend?.name}`}>
                        <Paper radius="lg" shadow='lg' onClick={clearUser} sx={interactive} withBorder p='sm'>
                            <Group m={0} p={0} align='center' direction='column'>
                                <Avatar src={friend?.image[friend.image.length - 1]['_']} radius={0} size='xl'>{friend?.name[0].substring(0, 2)}</Avatar>
                                <Text sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }} align='center'>{friend.name}</Text>
                            </Group>
                        </Paper>
                    </Link>
                </Grid.Col>
            )
        }
        let i = 0
        return (
            <Group position='center' sx={{ width: '100%' }}>
                <Grid sx={{ width: '100%' }} grow>
                    {friends?.map((friend: any) => {
                        i++
                        return (
                            <Friend key={i} friend={friend} />
                        )
                    })}
                </Grid>
            </Group>
        )
    }

    const Recents = () => {
        if (recents[0] === false) {
            return <Text align='center'>Nothing here...</Text>
        }
        const Rows = () => {
            let i = 0
            return (
                <>
                    {recents.map((song) => {
                        i++
                        return (<Grid.Col onClick={async () => {
                            loading.start()
                            const vid = await (await fetch(`${document.location.origin}/api/lastfm/youtube?artist=${encodeURIComponent(song.artist[0]['_'])}&track=${encodeURIComponent(song.name[0])}`)).json()
                            loading.stop()
                            router.push(`/song?v=${vid.split("=")[1]}`)
                        }} key={i} span={8} sm={6}>
                            <LFMSong song={song} type="recents" />
                        </Grid.Col>)
                    })}
                </>
            )
        }
        return (
            <Group sx={{ width: '100%' }} position='center'>
                <Grid grow>
                    <Rows />
                </Grid>
            </Group>
        )
    }

    const TopTracks = () => {
        if (recents[0] === false) {
            return <Text align='center'>Nothing here...</Text>
        }
        const Rows = () => {
            let i = 0
            return (
                <>
                    {toptracks.map((song) => {
                        i++
                        return (
                            <Grid.Col key={i} span={8} sm={6}>
                                <LFMSong key={i} song={song} type="top" />
                            </Grid.Col>
                        )
                    })}
                </>
            )
        }
        return (
            <Group sx={{ width: '100%' }} position='center'>
                <Grid grow>
                    <Rows />
                </Grid>
            </Group>
        )
    }

    if (!user) {
        return <></>
    }

    return (
        <Container>
            {user?.name[0] != props.auth.lfm.session[0].name[0] ? <Text mb='sm' className='link' onClick={() => { router.push('?'); clearUser() }} align='center'>Back to my profile</Text> : <></>}
            <Group spacing='sm' mb='md' direction='row'>
                <Avatar size='xl' radius={100} src={user?.image[user?.image.length - 1]['_']} />
                <Text sx={{ fontSize: '1.5em' }} size='xl'>{user?.realname[0] ? `${user?.realname} (${user?.name})` : user?.name}</Text>
                <Group spacing='sm'>
                    <Badge size='lg'>{user?.country[0]}</Badge>
                    <ActionIcon size='lg' component='a' target='_blank' href={user?.url[0]}>
                        <BrandLastfm />
                    </ActionIcon>
                </Group>
            </Group>
            <Accordion>
                <AccordionItem label="Friends" icon={<FriendsIcon />}>
                    <Friends />
                </AccordionItem>
                <AccordionItem label="Recent tracks" icon={<History />}>
                    <Recents />
                </AccordionItem>
                <AccordionItem label="Top tracks" icon={<Trophy />}>
                    <TopTracks />
                </AccordionItem>
            </Accordion>
        </Container>
    )
}

export const getServerSideProps = ({ req, res }: any) => {
    let auth = getCookie('auth', { req, res }) as any || false
    if (auth) { auth = JSON.parse(auth) }
    return { props: { 'auth': auth } };
}

export default LastFM