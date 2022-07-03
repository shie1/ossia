import { useLocalStorage } from "@mantine/hooks"
import lzString from "lz-string"
import { useEffect, useState } from "react"

export const compressedLocalStorage = {
    setItem: (key: any, value: any) => {
        if (typeof window === 'undefined') { return }
        localStorage.setItem(key, lzString.compress(JSON.stringify(value)))
    },
    getItem: (key: any) => {
        if (typeof window === 'undefined') { return }
        return JSON.parse(lzString.decompress(localStorage.getItem(key)!)!)
    }
}

export const useCompressedLocalStorage = ({ key, defaultValue }: { key: string, defaultValue: any }) => {
    const [outVal, setOutVal] = useLocalStorage<any>({ key: key, defaultValue: "" })
    const [inVal, setInVal] = useState<any>()
    const [dispVal, setDispVal] = useState<any>(defaultValue)
    useEffect(() => {
        if (typeof inVal !== 'undefined') setOutVal(lzString.compress(JSON.stringify(inVal)))
    }, [inVal, setOutVal])
    useEffect(() => {
        setDispVal(JSON.parse(lzString.decompress(outVal)!))
    }, [outVal])
    return [dispVal, setInVal]
}