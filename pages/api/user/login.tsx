import { pbkdf2Sync } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../components/mysql';
import { setCookie } from "cookies-next"
import { sign } from "jsonwebtoken"
require("dotenv").config()

function caesar(str: string, num: number) {
    var result = '';
    var charcode = 0;
    for (var i = 0; i < str.length; i++) {
        charcode = ((str[i].charCodeAt(0)) + num) % 65535;
        result += String.fromCharCode(charcode);
    }
    return result;
}

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        let rb = JSON.parse(req.body)
        rb["password"] = caesar(rb["password"], -Number(`${(new Date().getDate())}67${(new Date().getMonth())}`))

        executeQuery("SELECT `salt` FROM `users` WHERE (`username` = ?);", [rb.username]).then(salt => {
            salt = salt[0].salt
            const hash = pbkdf2Sync(rb.password, salt, 1000, 64, `sha512`).toString(`hex`);
            executeQuery("SELECT * FROM `users` WHERE (`username` = ? and `password` = ? and `salt` = ?);", [rb.username, hash, salt]).then(resp => {
                resp = resp[0]
                if (typeof resp !== "undefined") {
                    const token = sign({ username: resp.username, hash: resp.hash }, process.env["OSSIA_PRIVATE_KEY"] as string)
                    setCookie("token", token, { req: req, res: res, httpOnly: true, path: '/' })
                    return resolve(res.status(200).json(true))
                }
            })
        })
    })
}
