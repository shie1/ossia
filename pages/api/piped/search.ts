import type { NextApiRequest, NextApiResponse } from 'next'
import { apiroot } from '../../../components/piped'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        let np = ""
        let rb = req.query
        if (rb["nextpage"]) {
            np = "nextpage/"
        }
        const params = new URLSearchParams(rb as any).toString()
        let resp
        try { resp = await (await fetch(`${apiroot}/${np}search?${params}`)).json() } catch { resp = {} }
        resolve(res.status(200).json(resp))
    })
}
