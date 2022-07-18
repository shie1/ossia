import type { NextApiRequest, NextApiResponse } from 'next'
import { apiroot } from '../../../components/piped'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        let np = ""
        if (JSON.parse(req.body)["nextpage"]) {
            np = "nextpage/"
        }
        const params = new URLSearchParams(JSON.parse(req.body)).toString()
        const resp = await (await fetch(`${apiroot}/${np}search?${params}`)).json()
        resolve(res.status(200).json(resp))
    })
}
