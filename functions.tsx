import { unescape } from 'querystring'
import md5 from 'md5'

export const apiroot = "http://ws.audioscrobbler.com/2.0/"

export const genSig = (json: any, env: any) => {
    let sig = ""
    const keys = Object.keys(json)
    keys.sort()
    for (const item of keys) {
        sig = sig + item + json[item]
    }
    json['api_sig'] = md5(unescape(encodeURIComponent(sig + env.LASTFM_SECRET)))
    return json
}

export const htmlDecode = (input: any) => {
    const doc = new DOMParser().parseFromString(input, "text/html");
    return doc.documentElement.textContent;
}

export const getColorScheme = () => {
    return document.querySelector("html")?.getAttribute('data-theme')
}