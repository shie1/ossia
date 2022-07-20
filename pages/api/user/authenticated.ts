import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import { verify } from "jsonwebtoken"
import executeQuery from '../../../components/mysql'
require("dotenv").config()

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        const token = getCookie("token", { req: req, res: res, path: "/", httpOnly: true })
        if (!token) { return resolve(res.status(200).json(false)) }
        try {
            const jwt = verify(token as string, process.env["OSSIA_PRIVATE_KEY"] as string) as any
            executeQuery("SELECT * FROM `users` WHERE (`username` = ? and `salt` = ?)", [jwt.username, jwt.salt]).then(resp => {
                if (resp[0]) {
                    return resolve(res.status(200).json(jwt))
                } else {
                    return resolve(res.status(200).json(false))
                }
            })
        } catch {
            return resolve(res.status(200).json(false))
        }
    })
}
