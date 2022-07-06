import { useLocalStorage } from "@mantine/hooks"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { apiCall } from "./api"
import { useLastFM } from "./lastfm"
import { useLoading } from "./loading"
import { usePiped } from "./piped"

export const usePlayer = () => {
    const [element, setElement] = useState<HTMLAudioElement | null>(null)
    const [scrobbleVal, setScrobble] = useLocalStorage<boolean>({ 'key': 'scrobble', defaultValue: true })
    const [streamDetails, setStreamDetails] = useLocalStorage({ 'key': 'stream-details', 'defaultValue': {} })
    const [playerContent, setPlayerContent] = useLocalStorage({ 'key': 'player-content', 'defaultValue': {} })
    const [paused, setPaused] = useLocalStorage({ 'key': 'player-paused', 'defaultValue': false })
    const router = useRouter()
    const lastfm = useLastFM()
    const piped = usePiped()
    const loading = useLoading()
    const isPlaying = () => {
        return element!.currentTime > 0 && !element!.paused && !element!.ended
            && element!.readyState > element!.HAVE_CURRENT_DATA;
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && !element) {
            setElement(document.querySelector("audio#ossia-main-player") as HTMLAudioElement)
        }
    }, [element])
    function toggleState() {
        if (element?.paused) {
            element.play()
        } else {
            element?.pause()
        }
        setPaused(!isPlaying())
    }
    function play(stream: any, openPlayer = true) {
        if (element!.src == stream.audioStreams[stream.audioStreams.length - 1].url) {
            if (!isPlaying()) { toggleState() }
            if (openPlayer) { router.push("/player") }
            return
        }
        loading.start()
        apiCall("GET", "/api/youtube/recognize", { v: stream.thumbnailUrl.split("/")[4] }).then(resp => {
            resp = resp
            element!.src = stream.audioStreams[stream.audioStreams.length - 1].url
            setStreamDetails(stream)
            if (resp == false) {
                setPlayerContent({
                    'title': stream.title,
                    'artist': stream.uploader,
                    'cover': stream.thumbnailUrl,
                })
            } else {
                setPlayerContent({
                    'title': resp[0].SONG,
                    'artist': resp[0].ARTIST,
                    'album': resp[0].ALBUM,
                    'cover': resp[0].ALBUMART,
                })
            }
            setPaused(false)
            if (openPlayer) { router.push("/player") }
        })
    }
    function searchPlay(q: string, openPlayer = true) {
        piped.api("search", { 'q': q }).then(item => { piped.api("streams", { 'v': item.items[0].url.split("?v=")[1] }).then(item2 => { play(item2, openPlayer) }) })
    }
    function pop() {
        element!.src = ""
        setStreamDetails({})
        document.documentElement.setAttribute('data-loading', 'false')
    }
    return { 'paused': paused, setPaused: setPaused, 'play': play, 'toggleState': toggleState, 'pop': pop, searchPlay: searchPlay }
}