import type { NextApiRequest, NextApiResponse } from 'next'
import { apiroot } from '../../../components/piped'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const params = new URLSearchParams(JSON.parse(req.body))
        const resp = await (await fetch(`${apiroot}/search?${params.toString()}`)).json()
        resolve(res.status(200).json(resp))
    })
}
