export const apiroot = "http://ws.audioscrobbler.com/2.0/"
import { unescape } from "querystring"
import { createHash } from "crypto"

export const md5 = (text: string) => {
    return createHash("md5").update(text).digest("hex")
}

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