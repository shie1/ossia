// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ytdl from 'ytdl-core'
import type { videoInfo } from 'ytdl-core'

export default async function handler(
    req: any,
    res: NextApiResponse<videoInfo>
) {
    res.status(200).json(await ytdl.getInfo(req.query['v']))
}
