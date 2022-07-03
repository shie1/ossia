import type { NextPage } from "next";
import { usePlayer } from "../components/player";
import { usePiped } from "../components/piped";
import { useEffect, useState } from "react";
import { useCompressedLocalStorage } from "../components/storage";
import { TextInput } from "@mantine/core";

const Test: NextPage = () => {
    const [test, setTest] = useCompressedLocalStorage({ 'key': 'test', 'defaultValue': "asda" })
    return (<>
    </>)
}

export default Test