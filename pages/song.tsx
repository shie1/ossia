import { useLocalStorage } from "@mantine/hooks";
import type { NextPage } from "next";
import { useEffect, useState } from "react";
import { Player } from "../components";
import DocumentMeta from "react-document-meta";

const Listen: NextPage = (props: any) => {
    const [songDetails, setSongDetails] = useLocalStorage<any>({ 'key': 'song-details', 'defaultValue': {} })
    const [paused, setPaused] = useLocalStorage<boolean>({ 'key': 'paused', 'defaultValue': false })
    const [currentLQ, setCurrentLQ] = useLocalStorage<boolean>({ 'key': 'current-low-quality-mode', 'defaultValue': false })
    const [firstLoad, setFirstLoad] = useState<boolean>(true)

    useEffect(() => {
        if (props.details) {
            setSongDetails(props.details)
        }
    }, [setSongDetails, props.details])

    useEffect(() => {
        if (typeof window !== 'undefined' && firstLoad && props.id) {
            (document.querySelector("audio#mainPlayer") as HTMLAudioElement).src = `${location.origin}/api/youtube/stream?v=${props.id}${currentLQ ? '&q=lowestaudio' : ''}`
            setFirstLoad(true)
        }
    }, [currentLQ, firstLoad, props.id])

    return (<>
        <DocumentMeta {...{
            'title': `${songDetails.title} | Ossia`,
            'description': `Listen to ${songDetails.title} on the Ossia Music Player!`,
            'meta': {
                'og:image': songDetails.thumbnails[songDetails.thumbnails.length - 1].url,
            }
        }} />
    </>)
}

export async function getServerSideProps(ctx: any) {
    const protocol = (ctx.req.headers['x-forwarded-proto'] || ctx.req.headers.referer?.split('://')[0] || 'http')
    if (ctx.query['v']) {
        return {
            props: {
                id: ctx.query['v'],
                details: (await (await fetch(`${protocol}://${ctx.req.headers.host}/api/youtube/details?v=${ctx.query['v']}`)).json())['videoDetails'],
            },
        }
    } else {
        return {
            props: {}
        }
    }
}

export default Listen