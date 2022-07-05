import { useEffect, useState } from "react"

export const apiCall = async (method: "GET" | "POST", url: string, body: any) => {
    let res: any = ""
    switch (method) {
        case 'GET':
            return await (await fetch(`${url}?${(new URLSearchParams(body)).toString()}`)).json()
        case 'POST':
            return await (await fetch(url, { method: "POST", body: JSON.stringify(body) })).json()
    }
}