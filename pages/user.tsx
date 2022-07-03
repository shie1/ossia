import type { NextPage } from "next";
import { useRouter } from "next/router";
import { useApi } from "../components/api";
import { useCookies } from "react-cookie"
import { Avatar, Container, Group, Text, Badge, Grid, Paper, Accordion, AccordionItem } from "@mantine/core";
import { Action } from "../components/action";
import { BrandLastfm, Disc, Friends as FriendsIcon, Trophy } from "tabler-icons-react";
import { localized } from "../components/localization";
import { interactive } from "../components/styles";
import { LFMSong } from "../components/lastfm";

export const User: NextPage = () => {
    const router = useRouter()
    const [cookies, setCookies, removeCookies] = useCookies(["auth"])
    const user = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getInfo", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })
    const recentTracks = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getRecentTracks", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })
    const topTracks = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getTopTracks", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })
    const friends = useApi("POST", "/api/lastfm", { "method": "GET", 'options': { "method": "user.getFriends", "user": router.query['u'] ? router.query['u'] : cookies.auth?.lfm.session[0].name[0] } })

    const Friends = () => {
        if (!user) { return <></> }
        if (user.lfm.user[0].friends) {
            return (
                <Text align='center'>{localized.nothingHere}</Text>
            )
        }
        const Friend = ({ friend }: any) => {
            return (
                <Grid.Col span={2}>
                    <Paper radius="lg" shadow='lg' onClick={() => { document.location.href = (`/user?u=${friend?.name}`) }} sx={interactive} withBorder p='sm'>
                        <Group m={0} p={0} align='center' direction='column'>
                            <Avatar src={friend?.image[friend.image.length - 1]['_']} radius={0} size='xl'>{friend?.name[0].substring(0, 2)}</Avatar>
                            <Text sx={{ display: '-webkit-box', textOverflow: 'ellipsis', overflow: 'hidden', WebkitLineClamp: 1, WebkitBoxOrient: 'vertical' }} align='center'>{friend.name}</Text>
                        </Group>
                    </Paper>
                </Grid.Col >
            )
        }
        let i = 0
        return (
            <Group position='center' sx={{ width: '100%' }}>
                <Grid sx={{ width: '100%' }} grow>
                    {friends?.lfm.friends[0].user.map((friend: any) => {
                        i++
                        return (
                            <Friend key={i} friend={friend} />
                        )
                    })}
                </Grid>
            </Group>
        )
    }

    const RecentTracks = () => {
        if (!recentTracks) { return <></> }
        if (recentTracks.lfm.recenttracks[0] === false) {
            return <Text align='center'>{localized.nothingHere}</Text>
        }
        const Rows = () => {
            let i = 0
            return (
                <>
                    {recentTracks.lfm.recenttracks[0].track.map((song: any) => {
                        i++
                        return (<Grid.Col key={i} span={8} sm={6}>
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
        if (!topTracks) { return <></> }
        if (topTracks.lfm.toptracks[0] === false) {
            return <Text align='center'>{localized.nothingHere}</Text>
        }
        const Rows = () => {
            let i = 0
            return (
                <>
                    {topTracks.lfm.toptracks[0].track.map((song: any) => {
                        i++
                        return (<Grid.Col key={i} span={8} sm={6}>
                            <LFMSong song={song} type="top" />
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

    return (<Container>
        <Group direction="row">
            <Avatar size="xl" src={user?.lfm.user[0].image[user?.lfm.user[0].image.length - 1]['_']}>{user?.lfm.user[0].realname[0].substring(0, 2)}</Avatar>
            <Text sx={{ fontSize: '1.5em' }} size='xl'>{user?.lfm.user[0].realname[0] ? `${user?.lfm.user[0].realname} (${user?.lfm.user[0].name})` : user?.lfm.user[0].name}</Text>
            <Group spacing='sm'>
                <Badge size='lg'>{user?.lfm.user[0].country[0]}</Badge>
                <Action label={localized.openInLastFM} onClick={() => { window.open(user?.lfm.user[0].url[0]) }}>
                    <BrandLastfm />
                </Action>
            </Group>
        </Group>
        <Accordion mt="sm">
            <AccordionItem icon={<FriendsIcon />} label={localized.friends}>
                <Friends />
            </AccordionItem>
            <AccordionItem icon={<Disc />} label={localized.recentTracks}>
                <RecentTracks />
            </AccordionItem>
            <AccordionItem icon={<Trophy />} label={localized.topTracks}>
                <TopTracks />
            </AccordionItem>
        </Accordion>
    </Container>)
}

export default User;