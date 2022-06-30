import { useEffect, useState } from "react"

export const usePlayer = () => {
    const [element, setElement] = useState<HTMLAudioElement | false>(false)
    const [paused, setPaused] = useState<boolean>(true)
    useEffect(() => {
        if (typeof window !== 'undefined' && !element) {
            setElement(document.querySelector("audio#ossia-main-player") as HTMLAudioElement)
        }
    }, [element])
    useEffect(() => {
        if (!element) return;
        if (paused) {
            element.pause()
            if (paused != element.paused) { setPaused(element.paused) }
            document.documentElement.setAttribute('music-playing', 'false')
        } else {
            element.play()
            if (paused != element.paused) { setPaused(element.paused) }
            document.documentElement.setAttribute('music-playing', 'true')
        }
    }, [paused, element])
}