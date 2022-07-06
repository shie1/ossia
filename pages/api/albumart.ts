import type { NextApiRequest, NextApiResponse } from 'next'
import albumArt from "album-art"
import request from 'request'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const url = await albumArt(req.query['a'], { album: req.query['s'], size: 'large' })
        request(url).pipe(res)
        resolve(true)
    })
}
