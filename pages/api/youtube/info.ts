import type { NextApiRequest, NextApiResponse } from 'next'
import { getInfo } from "ytdl-core"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.status(200).json(await (getInfo(req.query['v'])))
}
