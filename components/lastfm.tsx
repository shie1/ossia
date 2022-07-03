import { unescape } from 'querystring'
import md5 from 'md5'
import { useCookies } from "react-cookie"
import superagent from "superagent"
const parser = require('superagent-xml2jsparser')

export const fetcher = (url: string) => fetch(url).then((res) => res.json());
export const apiroot = "http://ws.audioscrobbler.com/2.0/"

export const genSig = (json: any, exec = true, env: any) => {
    if (!exec) { return json }
    let sig = ""
    const keys = Object.keys(json)
    keys.sort()
    for (const item of keys) {
        sig = sig + item + json[item]
    }
    json['api_sig'] = md5(unescape(encodeURIComponent(sig + process.env.LASTFM_SECRET)))
    return json
}

export const useLastFM = () => {
    const [cookies, setCookies, removeCookies] = useCookies(['auth']);
    if (!cookies.auth) { return { 'cookie': false } }
    return { 'cookie': cookies.auth }
}