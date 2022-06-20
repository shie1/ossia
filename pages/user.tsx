import { Accordion, AccordionItem, ActionIcon, Anchor, Avatar, Badge, Container, Grid, Group, Paper, Table, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { BrandLastfm, Calendar, Clock, Friends as FriendsIcon, History, Microphone, Music } from 'tabler-icons-react'
import { getCookie } from 'cookies-next'
import moment from 'moment'
import Link from 'next/link'
import { useRouter } from 'next/router'
import { Collapse, interactivePaper } from '../components'

const LastFM: NextPage = (props: any) => {
    const [user, setUser] = useState<any>(false)
    const [friends, setFriends] = useState<Array<any>>([])
    const [recents, setRecents] = useState<Array<any>>([])
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
        'key': 'currentLQ', 'defaultValue': false
    })
    const [logged, setLogged] = useLocalStorage({
        'key': 'logged', 'defaultValue': false
    })
    const [loading, setLoading] = useLocalStorage<boolean>({ 'key': 'loading', 'defaultValue': false })

    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            setLoading(true)
            const user = (new URLSearchParams(location.search)).get("u")
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getInfo', ...(user ? { 'user': user } : { 'user': props.auth.lfm.session[0].name[0] }) }) }).then(async (resp: any) => {
                setUser((await resp.json()).lfm.user[0])
                setLoading(false)
            })
        }
    }, [props.auth, setLoading, user])

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
            setLoading(true)
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getFriends', 'user': user?.name }) }).then(async (resp: any) => {
                const json = await resp.json()
                setLoading(false)
                if (json.lfm.error) {
                    setFriends([false])
                } else {
                    setFriends(json.lfm.friends[0].user)
                }
            })
        }
    }, [user, friends, setLoading])

    useEffect(() => {
        if (user && typeof window !== 'undefined' && recents.length == 0) {
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getRecentTracks', 'user': user?.name }) }).then(async (resp: any) => {
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
        setLogged(props.auth !== false)
    }, [props, setLogged])

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
                        <Paper shadow='lg' onClick={clearUser} sx={interactivePaper} withBorder p='sm'>
                            <Group m={0} p={0} align='center' direction='column'>
                                <Avatar src={friend?.image[currentLQ ? 0 : friend.image.length - 1]['_']} radius={0} size='xl'>{friend?.name[0].substring(0, 2)}</Avatar>
                                <Text sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }} align='center'>{friend.name}</Text>
                            </Group>
                        </Paper>
                    </Link>
                </Grid.Col>
            )
        }
        let i = 0
        return (
            <Group position='center' sx={{width: '100%'}}>
                <Grid sx={{width: '100%'}} grow>
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
                        const style: any = { 'fontSize': '2vmin' };
                        return (
                            <tr className='user-recents-tr' onClick={async () => {
                                setLoading(true)
                                const vid = await (await fetch(`${document.location.origin}/api/lastfm/youtube?artist=${encodeURIComponent(song.artist[0]['_'])}&track=${encodeURIComponent(song.name[0])}`)).json()
                                setLoading(false)
                                router.push(`/song?v=${vid.split("=")[1]}`)
                            }} key={i}>
                                <td style={style}>{song.name[0]}</td>
                                <td style={style}>{song.artist[0]['_']}</td>
                                <td style={style}>{moment(moment.utc(song.date[0]['_']).toDate()).local().fromNow()}</td>
                            </tr>
                        )
                    })}
                </>
            )
        }
        return (
            <Group sx={{ width: '100%' }} position='center'>
                <Table>
                    <thead>
                        <tr>
                            <th><Music /></th>
                            <th><Microphone /></th>
                            <th><Clock /></th>
                        </tr>
                    </thead>
                    <tbody>
                        <Rows />
                    </tbody>
                </Table>
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
                <Avatar size='xl' radius={100} src={user?.image[currentLQ ? 0 : user?.image.length - 1]['_']} />
                <Text sx={{ fontSize: '1.5em' }} size='xl'>{user?.realname[0] ? `${user?.realname} (${user?.name})` : user?.name}</Text>
                <Group spacing='sm'>
                    <Badge size='lg'>{user?.country[0]}</Badge>
                    <ActionIcon size='lg' component='a' target='_blank' href={user?.url[0]}>
                        <BrandLastfm />
                    </ActionIcon>
                </Group>
            </Group>
            <Group grow spacing='sm'>
                <Collapse title="Friends" icon={<FriendsIcon />}>
                    <Friends />
                </Collapse>
                <Collapse title="Recent tracks" icon={<History />}>
                    <Recents />
                </Collapse>
            </Group>
        </Container>
    )
}

export const getServerSideProps = ({ req, res }: any) => {
    let auth = getCookie('auth', { req, res }) as any || false
    if (auth) { auth = JSON.parse(auth) }
    return { props: { 'auth': auth } };
}

export default LastFM