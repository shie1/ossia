import { pbkdf2Sync } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../components/mysql';
import { setCookie } from "cookies-next"
import { sign } from "jsonwebtoken"
require("dotenv").config()

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        let { username, password } = JSON.parse(req.body)
        executeQuery("SELECT `salt` FROM `users` WHERE (`username` = ?);", [username]).then(salt => {
            if (!salt[0]) { return resolve(res.status(200).json(false)) }
            salt = salt[0].salt
            const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);
            executeQuery("SELECT * FROM `users` WHERE (`username` = ? and `password` = ? and `salt` = ?);", [username, hash, salt]).then(resp => {
                resp = resp[0]
                if (typeof resp !== "undefined") {
                    const token = sign({ username: resp.username, salt: resp.salt }, process.env["OSSIA_PRIVATE_KEY"] as string)
                    setCookie("token", token, { req: req, res: res, httpOnly: true, path: '/' })
                    return resolve(res.status(200).json(true))
                }
            })
        })
    })
}
