import type { NextApiRequest, NextApiResponse } from 'next'
import ytdl from "ytdl-core"
import albumArt from "album-art"
import { search } from '../../../components/lastfm'
import { recognize } from '../../../components/yt'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        return resolve(res.status(200).json(await recognize(req.query['v'] as string)))
    })
}