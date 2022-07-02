import type { NextPage } from "next";
import { usePlayer } from "../components/player";
import { usePiped } from "../components/piped";
import { useEffect, useState } from "react";
import { useCompressedLocalStorage } from "../components/storage";

const Test: NextPage = () => {
    const cls = useCompressedLocalStorage()
    cls.setItem("test", {'a':'b'})
    return (<>
        {JSON.stringify(cls.getItem("test"))}
    </>)
}

export default Test