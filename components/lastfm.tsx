export const apiroot = "http://ws.audioscrobbler.com/2.0/"
import { unescape } from "querystring"
import { createHash } from "crypto"
import superagent from "superagent"
const parser = require('superagent-xml2jsparser')
require('dotenv').config()

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

export const search = (params: any) => {
    return new Promise((resolve, reject) => {
        superagent.get(apiroot)
            .query({
                'method': 'track.search',
                'api_key': process.env.LASTFM_KEY,
                ...params
            })
            .parse(parser)
            .buffer(true)
            .end((err, resp: any) => {
                if (err) { console.log(err) }
                return resolve(resp.body)
            })
    })
}

export const albumInfo = (params: any) => {
    return new Promise((resolve, reject) => {
        superagent.get(apiroot)
            .query({
                'method': 'album.getInfo',
                'api_key': process.env.LASTFM_KEY,
                ...params
            })
            .parse(parser)
            .buffer(true)
            .end((err, resp: any) => {
                if (err) { console.log(err) }
                return resolve(resp.body)
            })
    })
}