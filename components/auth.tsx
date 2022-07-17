import { useState } from "react"
import { apiCall } from "./api"

export const useMe = () => {
    const [me, setMe] = useState<any>("")
    apiCall("GET", "/api/authenticated", {}).then(resp => { setMe(resp) })
    return me
}