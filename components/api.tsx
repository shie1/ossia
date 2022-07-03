import { useEffect, useState } from "react"

export const useApi = (method: "GET" | "POST", url: string, body: any) => {
    const [resp, setResp] = useState<any>()
    useEffect(() => {
        if (!resp) {
            switch (method) {
                case 'GET':
                    fetch(`${url}?${(new URLSearchParams(body)).toString()}`).then(resp => resp.json()).then(resp => { setResp(resp) })
                    break
                case 'POST':
                    fetch(url, { method: "POST", body: JSON.stringify(body) }).then(resp => resp.json()).then(resp => { setResp(resp) })
                    break
            }
        }
    }, [body, method, resp, url])
    return resp
}