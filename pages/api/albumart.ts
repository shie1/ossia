import type { NextApiRequest, NextApiResponse } from 'next'
import albumArt from "album-art"
import request from 'request'
import ytdl from 'ytdl-core'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        let url: any
        url = await albumArt(req.query['a'], { album: req.query['b'] || req.query['s'], size: 'large' })
        if (typeof url === 'object') {
            res.status(200).json(false)
        } else {
            request(url).pipe(res)
        }

        resolve(true)
    })
}
