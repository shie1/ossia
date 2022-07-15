import type { NextApiRequest, NextApiResponse } from 'next'
import { apiroot } from '../../../components/piped'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const resp = await (await fetch(`${apiroot}/streams/${JSON.parse(req.body)['v']}`)).json()
        resolve(res.status(200).json(resp))
    })
}
