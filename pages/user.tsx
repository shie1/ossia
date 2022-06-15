import { Accordion, AccordionItem, ActionIcon, Anchor, Avatar, Badge, Grid, Group, Paper, Table, Text } from '@mantine/core'
import { useLocalStorage } from '@mantine/hooks'
import type { NextPage } from 'next'
import { useEffect, useState } from 'react'
import { BrandLastfm, Calendar, Clock, Friends as FriendsIcon, History, Microphone, Music } from 'tabler-icons-react'
import { getCookie } from 'cookies-next'
import moment from 'moment'

const LastFM: NextPage = (props: any) => {

    const [user, setUser] = useState<any>()
    const [friends, setFriends] = useState<Array<any>>([])
    const [recents, setRecents] = useState<Array<any>>([])
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({
        'key': 'currentLQ', 'defaultValue': false
    })
    const [logged, setLogged] = useLocalStorage({
        'key': 'logged', 'defaultValue': false
    })

    useEffect(() => {
        if (!user && typeof window !== 'undefined') {
            const user = (new URLSearchParams(location.search)).get("u")
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getInfo', ...(user ? { 'user': user } : { 'user': props.auth.lfm.session[0].name[0] }) }) }).then(async (resp: any) => {
                setUser((await resp.json()).lfm.user[0])
            })
        }
    }, [props.auth.lfm.session, user])

    useEffect(() => {
        if (user && typeof window !== 'undefined' && friends.length == 0) {
            fetch(`${document.location.origin}/api/lastfm/api`, { method: 'POST', body: JSON.stringify({ 'method': 'user.getFriends', 'user': user?.name }) }).then(async (resp: any) => {
                const json = await resp.json()
                if (json.lfm.error) {
                    setFriends([false])
                } else {
                    setFriends(json.lfm.friends[0].user)
                }
            })
        }
    }, [user, friends])

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
                    <Paper component='a' href={`?u=${friend?.name}`} className='nodim menuLink' withBorder p='sm'>
                        <Group m={0} p={0} align='center' direction='column'>
                            <Avatar src={friend?.image[currentLQ ? 0 : friend.image.length - 1]['_']} radius={0} size='xl' />
                            <Text sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }} align='center'>{friend.name}</Text>
                        </Group>
                    </Paper>
                </Grid.Col>
            )
        }
        let i = 0
        return (
            <Grid grow>
                {friends?.map((friend: any) => {
                    i++
                    return (
                        <Friend key={i} friend={friend} />
                    )
                })}
            </Grid>
        )
    }

    const Recents = () => {
        const timeSince = (date: Date) => {
            var seconds = Math.floor((new Date().getTime() - date.getTime()) / 1000);

            var interval = seconds / 31536000;

            if (interval > 1) {
                return Math.floor(interval) + " years";
            }
            interval = seconds / 2592000;
            if (interval > 1) {
                return Math.floor(interval) + " months";
            }
            interval = seconds / 86400;
            if (interval > 1) {
                return Math.floor(interval) + " days";
            }
            interval = seconds / 3600;
            if (interval > 1) {
                return Math.floor(interval) + " hours";
            }
            interval = seconds / 60;
            if (interval > 1) {
                return Math.floor(interval) + " minutes";
            }
            return Math.floor(seconds) + " seconds";
        }

        if (recents[0] === false) {
            return <Text align='center'>Nothing here...</Text>
        }
        const Rows = () => {
            let i = 0
            return (
                <>
                    {recents.map((song) => {
                        i++
                        const style:any = {'fontSize':'1em'};
                        return (
                            <tr key={i}>
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
            <>
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
            </>
        )
    }

    return (
        <>
            <Group mb='md' direction='row'>
                <Avatar size='xl' radius={100} src={user?.image[currentLQ ? 0 : user.image.length - 1]['_']} />
                <Text sx={{ fontSize: '1.5em' }} size='xl'>{user?.realname[0] ? `${user?.realname} (${user?.name})` : user?.name}</Text>
                <Badge>{user?.country[0]}</Badge>
                <ActionIcon component='a' target='_blank' href={user?.url[0]}>
                    <BrandLastfm />
                </ActionIcon>
            </Group>
            <Accordion>
                <AccordionItem label="Friends" icon={<FriendsIcon />}>
                    <Friends />
                </AccordionItem>
                <AccordionItem label="Recent tracks" icon={<History />}>
                    <Recents />
                </AccordionItem>
            </Accordion>
        </>
    )
}

export const getServerSideProps = ({ req, res }: any) => {
    let auth = getCookie('auth', { req, res }) as any || false
    if (auth) { auth = JSON.parse(auth) }
    return { props: { 'auth': auth } };
}

export default LastFM