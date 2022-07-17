import type { NextApiRequest, NextApiResponse } from 'next'
import { usernameAvailable } from '../../../components/user'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        resolve(res.status(200).json(await usernameAvailable(JSON.parse(req.body)["username"])))
    })
}
