import type { NextApiRequest, NextApiResponse } from 'next'
import { removeCookies } from 'cookies-next'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    removeCookies("token", { req: req, res: res, path: '/',httpOnly:true })
    res.status(200).json(true)
}
