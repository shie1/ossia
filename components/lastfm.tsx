import { unescape } from 'querystring'
import md5 from 'md5'
import { useCookies } from "react-cookie"
import superagent from "superagent"
import { interactive } from './styles'
import { Group, Paper, Avatar, Text } from '@mantine/core'
import moment from "moment/min/moment-with-locales"
import { localized } from './localization'
import { usePlayer } from './player'
import { useLoading } from './loading'
const parser = require('superagent-xml2jsparser')

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const apiroot = "http://ws.audioscrobbler.com/2.0/"

export const genSig = (json: any, exec = true, env: any) => {
    if (!exec) { return json }
    let sig = ""
    const keys = Object.keys(json)
    keys.sort()
    for (const item of keys) {
        sig = sig + item + json[item]
    }
    json['api_sig'] = md5(unescape(encodeURIComponent(sig + process.env.LASTFM_SECRET)))
    return json
}

export const useLastFM = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['auth']);
    if (!cookies.auth) { return { 'cookie': false } }
    return { 'cookie': cookies.auth }
}

export const LFMSong = ({ song, type }: any) => {
    const player = usePlayer()
    const loading = useLoading()
    moment.locale(localized.getLanguage())
    const More = () => {
        switch (type) {
            case 'recents':
                return <>
                    <Group position="right" pt='sm' sx={(theme) => ({ borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.white : theme.black}` })}>
                        <Text size="sm">{song.date ? (moment(moment.utc(song.date[0]['_']).toDate()).local().fromNow()) : localized.nowPlaying}</Text>
                    </Group>
                </>
            case 'top':
                return <>
                    <Group position="right" pt='sm' direction="row" sx={(theme) => ({ borderTop: `1px solid ${theme.colorScheme === 'dark' ? theme.white : theme.black}` })}>
                        <Text size="sm">{song.playcount[0]} {localized.plays}</Text>
                    </Group>
                </>
            default:
                return <></>
        }
    }
    if (!song) { return <></> }
    return (<>
        <Paper onClick={() => { player.searchPlay(`${song.artist[0].name ? song.artist[0].name : (song.artist[0] as any)['_']} ${song.name[0]}`); loading.start() }} withBorder sx={interactive} m={-2} p='sm'>
            <Group mb='sm' direction="row">
                <Group spacing={0} direction="column">
                    <Text sx={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box' }} size="lg">{song.name[0]}</Text>
                    <Text sx={{ WebkitBoxOrient: 'vertical', WebkitLineClamp: 1, overflow: 'hidden', textOverflow: 'ellipsis', display: '-webkit-box' }} size="md">{song.artist[0].name ? song.artist[0].name : (song.artist[0] as any)['_']}</Text>
                </Group>
            </Group>
            <More />
        </Paper>
    </>)
}