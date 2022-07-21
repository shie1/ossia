import type { NextApiRequest, NextApiResponse } from 'next'
import { recognize } from '../../../components/yt'

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        return resolve(res.status(200).json(await recognize(req.query['v'] as string)))
    })
}