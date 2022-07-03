import { useLocalStorage } from "@mantine/hooks"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { useLastFM } from "./lastfm"

export const usePlayer = () => {
    const [element, setElement] = useState<HTMLAudioElement | null>(null)
    const [scrobbleVal, setScrobble] = useLocalStorage<boolean>({ 'key': 'scrobble', defaultValue: true })
    const [streamDetails, setStreamDetails] = useLocalStorage({ 'key': 'stream-details', 'defaultValue': {} })
    const [paused, setPaused] = useLocalStorage({ 'key': 'player-paused', 'defaultValue': false })
    const router = useRouter()
    const lastfm = useLastFM()
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
    async function scrobble(stream: any) {
        if (typeof window === 'undefined') { return }
        const prR = /\(([^)]+)\)|【([^】]+)】|\{([^\}]+)\}|\[([^\]]+)\]|"|“|”/g
        const videoTitle = stream.title!.replace(prR, '')
        const videoAuthor = stream.uploaderName || stream.uploader
        const videoDescription = stream.description
    }
    function play(stream: any, openPlayer = true) {
        if (element!.src == stream.audioStreams[stream.audioStreams.length - 1].url) {
            if (!isPlaying()) toggleState()
            router.push("/player"); return
        }
        element!.src = stream.audioStreams[stream.audioStreams.length - 1].url
        setStreamDetails(stream)
        setPaused(false)
        if (openPlayer) router.push("/player")
        if (scrobbleVal) { scrobble(stream) }
    }
    function pop() {
        element!.src = ""
        setStreamDetails({})
        document.documentElement.setAttribute('data-loading', 'false')
    }
    return { 'paused': paused, 'play': play, 'toggleState': toggleState, 'pop': pop }
}