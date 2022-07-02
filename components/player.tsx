import { useLocalStorage } from "@mantine/hooks"
import { useRouter } from "next/router"
import { useEffect, useState } from "react"

export const usePlayer = () => {
    const [element, setElement] = useState<HTMLAudioElement | null>(null)
    const [streamDetails, setStreamDetails] = useLocalStorage({ 'key': 'stream-details', 'defaultValue': {} })
    const [paused, setPaused] = useState<boolean>(false)
    const router = useRouter()
    const isPlaying = () => {
        return element!.currentTime > 0 && !element!.paused && !element!.ended
            && element!.readyState > element!.HAVE_CURRENT_DATA;
    }
    useEffect(() => {
        if (typeof window !== 'undefined' && !element) {
            setElement(document.querySelector("audio#ossia-main-player") as HTMLAudioElement)
        }
    }, [element])
    function play(stream: any) {
        element!.src = stream.audioStreams[stream.audioStreams.length - 1].url
        if (!isPlaying()) { element!.play() }
        console.log(isPlaying())
        setStreamDetails(stream)
    }
    function toggleState() {
        if(element?.paused){
            element.play()
        }else{
            element?.pause()
        }
        setPaused((element?.paused as any))
    }
    function pop(){
        element!.src = ""
        setStreamDetails({})
        if(router.pathname == "/player"){
            router.push("/")
        }
    }
    return { 'paused': paused, 'play': play, 'toggleState': toggleState, 'pop': pop }
}