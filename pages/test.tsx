import type { NextPage } from "next";
import { usePlayer } from "../components/player";
import { usePiped } from "../components/piped";
import { useEffect, useState } from "react";

const Test: NextPage = () => {
    const [r, sr] = useState<any>()
    const player = usePlayer()
    const piped = usePiped()
    useEffect(() => {
        if (!r) {
            piped.api("search", { "q": "hello" }).then(data => { sr(data) })
        }
    })
    return (<>
        {JSON.stringify(r)}
    </>)
}

export default Test