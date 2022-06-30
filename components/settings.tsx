import { useLocalStorage } from "@mantine/hooks"
import { useEffect, useState } from "react"
import { hashKeys } from "../functions"

export const defaultSettings: any = {

}

export const useSettings = () => {
    const [settings, setSettings] = useLocalStorage<any>({ 'key': 'user-preferences', 'defaultValue': defaultSettings })
    useEffect(() => {
        if (hashKeys(settings) != hashKeys(defaultSettings)) {
            console.log(Object.keys(settings), Object.keys(defaultSettings))
            const missing = Object.keys(defaultSettings).filter((opt: string) => !Object.keys(settings).includes(opt))
            let fill: any = {}
            for (const key of missing) {
                fill[key] = defaultSettings[key]
            }
            setSettings({ ...settings, ...fill })
        }
    }, [setSettings, settings])
    function edit(key: string, value: any) {
        if (!Object.keys(defaultSettings).includes(key)) {
            throw Error(`${key} is not a setting`)
        }
    }
    return { 'edit': edit, 'values': settings }
}