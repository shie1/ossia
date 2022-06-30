import { useLocalStorage } from "@mantine/hooks"
import { useEffect } from "react"
import { hashKeys } from "../functions"

export const defaultSettings: any = {
}

export const useSettings = () => {
    const [settings, setSettings] = useLocalStorage<any>({ 'key': 'user-preferences', 'defaultValue': defaultSettings })
    useEffect(() => {
        if (hashKeys(settings) != hashKeys(defaultSettings)) {
            let mySettings = settings
            const missing = Object.keys(defaultSettings).filter((opt: string) => !Object.keys(settings).includes(opt))
            let fill: any = {}
            for (const key of missing) {
                fill[key] = defaultSettings[key]
            }
            const removed = Object.keys(settings).filter((opt: string) => !Object.keys(defaultSettings).includes(opt))
            for (const key of removed) {
                delete mySettings[key]
            }
            setSettings({ ...mySettings, ...fill })
        }
    }, [setSettings, settings])
    function edit(key: string, value: any) {
        if (!Object.keys(defaultSettings).includes(key)) {
            throw Error(`${key} is not a setting`)
        }
        if (!value) {
            throw Error(`setting value cannot be empty`)
        }
        let mySettings = settings
        mySettings[key] = value
    }
    return { 'edit': edit, 'values': settings }
}