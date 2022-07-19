import type { NextApiRequest, NextApiResponse } from 'next'
import request from "request"
import albumArt from "album-art"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        let url: any
        url = await albumArt(req.query['a'], { album: req.query['b'] !== "undefined" ? req.query['b'] : req.query['s'], size: 'large' })
        if (typeof url === 'object') {
            return resolve(res.status(200).json(false))
        } else {
            return request(url).pipe(res)
        }
    })
}
