import { RefObject, useEffect, useState } from "react";

export const usePlayer = (player: RefObject<null | HTMLAudioElement>) => {
    // play, queue(state), paused(state), loop(state: 0,1,2)
    const [paused, setPaused] = useState<boolean>(true)
    const [queue, setQueue] = useState<Array<any>>([])
    const [streams, setStreams] = useState<any>()

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

    useEffect(() => {
        setPaused(player.current?.paused || true)
    }, [player.current?.paused])

    const play = (p_streams: any) => {
        setStreams(p_streams)
        if (player.current === null) { return }
        player.current.src = p_streams.audioStreams[p_streams.audioStreams.length - 1].url
        if (player.current.paused) { player.current.play() }
    }

    return {
        paused: [paused, setPaused],
        queue: [queue, setQueue],
        play,
        streams: streams
    }
}