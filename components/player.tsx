import { showNotification } from "@mantine/notifications";
import { useRouter } from "next/router";
import { RefObject, useEffect, useState } from "react";
import { SortAscending } from "tabler-icons-react";
import { apiCall } from "./api";
import { localized } from "./localization";

const myShift = (list: Array<any>) => {
    list.shift()
    return list
}

export const usePlayer = (player: RefObject<null | HTMLAudioElement>) => {
    // play, queue(state), paused(state), loop(state: 0,1,2)
    const [paused, setPaused] = useState<boolean>(true)
    const [queue, setQueue] = useState<Array<any>>([])
    const [streams, setStreams] = useState<any>({})
    const [sessionHistory, setSessionHistory] = useState<Array<any>>([])
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
            if (resp.length === 1 && Object.keys(streams).length) {
                window.dispatchEvent(new Event("ossia-song-update"))
                setPlayerDisp((old: any) => ({ ...old, ...resp[0] }))
            }
        })
    }, [streams, setPlayerDisp])

    useEffect(() => {
        if (typeof window !== 'undefined' && Object.keys(playerDisp).length) {
            navigator.mediaSession.metadata = new MediaMetadata({
                title: playerDisp["SONG"],
                artist: playerDisp["ARTIST"],
                album: playerDisp["ALBUM"],
                artwork: [
                    { src: playerDisp["ALBUMART"] }
                ]
            })
            window.dispatchEvent(new Event("ossia-song-metadata"))
        }
    }, [playerDisp])

    useEffect(() => {
        if (typeof window !== 'undefined') {
            navigator.mediaSession.setActionHandler("pause", () => { setPaused(true) })
            navigator.mediaSession.setActionHandler("play", () => { setPaused(false) })
            navigator.mediaSession.setActionHandler("stop", () => { pop() })
            navigator.mediaSession.setActionHandler("nexttrack", () => { skip() })
        }
    }, [])

    useEffect(() => {
        if (player.current === null) { return }
        if (paused) {
            if (!player.current.paused) {
                player.current.pause()
                window.dispatchEvent(new Event("ossia-song-pause"))
                navigator.mediaSession.playbackState = "paused"
            }
        } else {
            if (player.current.paused) {
                player.current.play()
                window.dispatchEvent(new Event("ossia-song-resume"))
                navigator.mediaSession.playbackState = "playing"
            }
        }
    }, [paused])

    const play = (p_streams: any, openPlayer: boolean = false) => {
        setSessionHistory(old => [...old, p_streams.thumbnailUrl.split("/")[4]])
        setStreams(p_streams)
        if (player.current === null) { return }
        player.current.src = p_streams.audioStreams[p_streams.audioStreams.length - 1].url
        if (player.current.paused) { player.current.play().then(() => { setPaused(player.current!.paused) }) }
        navigator.mediaSession.playbackState = "playing"
        if (openPlayer) { router.push("/player") }
    }

    const pop = () => {
        setQueue([])
        window.dispatchEvent(new Event("ossia-song-update"))
        window.dispatchEvent(new Event("ossia-pop-player"))
        navigator.mediaSession.playbackState = "none"
        player.current!.src = ""
        setStreams({})
        setPlayerDisp({})
        if (router.pathname === "/player") { router.replace("/") }
    }

    const quickPlay = (id: string, openPlayer: boolean = false) => {
        return new Promise((resolve, reject) => {
            apiCall("GET", "/api/piped/streams", { v: id }).then(resp => { resolve(play(resp, openPlayer)) })
        })
    }

    const addToQueue = (id: string, place: "first" | "last" = "first", alert: boolean = true) => {
        let br = false
        window.addEventListener("ossia-pop-player", () => {
            br = true
        })
        return new Promise((resolve, reject) => {
            apiCall("GET", "/api/youtube/recognize", { v: id }).then(([recog]: any) => {
                apiCall("GET", "/api/piped/streams", { v: id }).then(resp => {
                    if (!br) {
                        setQueue(old => (place === "first" ? [{ ...resp, ...recog }, ...old] : [...old, { ...resp, ...recog }]))
                        if (alert) { showNotification({ title: localized.addedToQueue, message: localized.addFirst, icon: <SortAscending /> }) }
                        window.dispatchEvent(new Event("ossia-queue-update"))
                    }
                    return resolve(true)
                })
            })
        })
    }

    const queueArrInOrder = (idlist: Array<string>) => {
        let q: Array<any> = []
        for (let id of idlist) {
            apiCall("GET", "/api/youtube/recognize", { v: id }).then(([recog]: any) => {
                apiCall("GET", "/api/piped/streams", { v: id }).then(resp => {
                    q.push({ ...resp, ...recog })
                })
            })
        }
        setQueue(q)
        window.dispatchEvent(new Event("ossia-queue-update"))
    }

    const skip = () => {
        player.current!.currentTime = player.current!.duration
    }

    const removeFromQueue = (index: number) => {
        console.log(index, queue)
        let newArr = queue
        newArr.splice(index, 1)
        setQueue(newArr)
        window.dispatchEvent(new Event("ossia-queue-update"))
    }

    useEffect(() => {
        player.current!.onended = () => {
            if (!queue.length) {
                if (!streams.relatedStreams) { return }
                let availableStreams = streams.relatedStreams.filter((item: any) => !sessionHistory.includes(item.url.split("?v=")[1]))
                quickPlay(availableStreams[0].url.split("?v=")[1])
            } else {
                if (typeof queue[0] === 'string') {
                    quickPlay(queue[0])
                } else {
                    play(queue[0])
                }
                setQueue(myShift(queue))
            }
        }
    }, [streams, queue])

    useEffect(() => {
        if (queue.length) {
            if (player.current!.src.startsWith(document.location.origin) || !player.current!.src) {
                if (typeof queue[0] === 'string') {
                    quickPlay(queue[0])
                } else {
                    play(queue[0])
                }
                setQueue(myShift(queue))
            }
        }
    }, [queue])

    return {
        paused: [paused, setPaused],
        queue: [queue, setQueue],
        play,
        playerRef: player,
        streams,
        playerDisp,
        skip,
        addToQueue,
        quickPlay,
        queueArrInOrder,
        removeFromQueue,
        pop,
        sessionHistory,
    }
}