import { useEffect, useState } from "react"
import UAParser from "ua-parser-js"

export const useUserAgent = () => {
    const [userAgent, setUserAgent] = useState<UAParser.IResult | undefined>()
    useEffect(() => {
        if (typeof window !== 'undefined') {
            setUserAgent(new UAParser(window.navigator.userAgent as string).getResult())
        }
    }, [])
    return userAgent
}