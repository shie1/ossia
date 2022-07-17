import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import { verify } from "jsonwebtoken"
require("dotenv").config()

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const token = getCookie("token", { req: req, res: res, path: "/", httpOnly: true })
    if (!token) { return res.status(200).json(false) }
    res.status(200).json(verify(token as string, process.env["OSSIA_PRIVATE_KEY"] as string))
}
