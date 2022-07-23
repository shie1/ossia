import type { NextApiRequest, NextApiResponse } from 'next'
import { apiroot } from '../../../components/piped'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const url = `${apiroot}/streams/${(req.query['v'] as string).replace(/\//g, '')}`
        const resp = await (await fetch(url.search(/\?/g) ? url.split("?")[0] : url)).json()
        resolve(res.status(200).json(resp))
    })
}
