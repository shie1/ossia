import { useEffect, useState } from "react"
import { server } from "./config"

export const apiCall = async (method: "GET" | "POST", url: string, body: any) => {
    if (url.startsWith("/")) { url = server + url }
    switch (method) {
        case 'GET':
            return await (await fetch(`${url}?${(new URLSearchParams(body)).toString()}`)).json()
        case 'POST':
            return await (await fetch(url, { method: "POST", body: JSON.stringify(body) })).json()
    }
}