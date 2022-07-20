import { useLocalStorage } from "@mantine/hooks";
import { useRouter } from "next/router";
import { RefObject, useCallback, useEffect, useState } from "react";
import { apiCall } from "./api";

const myShift = (list: Array<any>) => {
    list.shift()
    return list
}

export const usePlayer = (player: RefObject<null | HTMLAudioElement>) => {
    // play, queue(state), paused(state), loop(state: 0,1,2)
    const [paused, setPaused] = useState<boolean>(true)
    const [queue, setQueue] = useState<Array<any>>([])
    const [streams, setStreams] = useState<any>({})
    const [playerDisp, setPlayerDisp] = useState<any>({})
    const router = useRouter()

    useEffect(() => {
        if (!Object.keys(streams).length) { return }
        window.dispatchEvent(new Event("ossia-song-update"))
        setPlayerDisp({
            "ARTIST": streams.uploader,
            "SONG": streams.title,
            "ALBUMART": streams.thumbnailUrl
        })
        apiCall("GET", "/api/youtube/recognize", { v: streams.thumbnailUrl.split("/")[4] }).then(resp => {
            if (resp.length === 1) {
                window.dispatchEvent(new Event("ossia-song-update"))
                setPlayerDisp((old: any) => ({ ...old, ...resp[0] }))
            }
        })
    }, [streams, setPlayerDisp])

    useEffect(() => {
        if (player.current === null) { return }
        if (paused) {
            if (!player.current.paused) {
                player.current.pause()
            }
        } else {
            if (player.current.paused) {
                player.current.play()
            }
        }
    }, [paused])

    const play = (p_streams: any) => {
        setStreams(p_streams)
        if (player.current === null) { return }
        player.current.src = p_streams.audioStreams[p_streams.audioStreams.length - 1].url
        if (player.current.paused) { player.current.play().then(() => { setPaused(player.current!.paused) }) }
    }

    const pop = () => {
        window.dispatchEvent(new Event("ossia-song-update"))
        player.current!.src = ""
        setStreams({})
        setPlayerDisp({})
        router.replace("/")
    }

    useEffect(() => {
        player.current!.onended = () => {
            if (!queue.length) {
                apiCall("GET", "/api/piped/streams", { v: streams.relatedStreams[0].url.split("?v=")[1] }).then(resp => { play(resp) })
            } else {
                play(queue[0])
                setQueue(myShift(queue))
            }
        }
    }, [streams])

    useEffect(() => {
        if (queue.length) {
            if (player.current!.src.startsWith(document.location.origin) || !player.current!.src) {
                play(queue[0])
                setQueue(myShift(queue))
            }
        }
    }, [queue])

    return {
        paused: [paused, setPaused],
        queue: [queue, setQueue],
        play,
        streams,
        playerDisp,
        pop,
    }
}