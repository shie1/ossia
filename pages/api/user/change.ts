import { pbkdf2Sync, randomBytes } from 'crypto';
import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'
import { validatePassword } from '../../../components/user';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const { username } = getJWT(req, res)
        if (!username) { return resolve(res.status(200).json(false)) }
        let { password, newPassword } = JSON.parse(req.body)

        validatePassword(username, password).then(resp => {
            console.log(resp)
            if (resp) {
                const salt = randomBytes(16).toString('hex')
                const hash = pbkdf2Sync(newPassword, salt, 1000, 64, `sha512`).toString(`hex`);

                executeQuery("UPDATE `users` SET `password` = ?, `salt` = ? WHERE (`username` = ?);", [hash, salt, username]).then(() => {
                    res.status(200).json(true)
                })
            } else {
                return resolve(res.status(200).json(false))
            }
        })
    })
}
