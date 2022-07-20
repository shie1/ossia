import { useRouter } from "next/router"
import { useEffect, useState } from "react"
import { apiCall } from "./api"

export const useMe = () => {
    const [me, setMe] = useState<any>("")
    const router = useRouter()
    useEffect(() => {
        apiCall("GET", "/api/user/authenticated", {}).then(resp => { setMe(resp) })
    }, [router])
    return me
}