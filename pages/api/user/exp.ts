import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.status(200).json(getJWT(req, res))
}
