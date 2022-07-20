// INSERT INTO `ossia`.`users` (`username`, `password`, `salt`) VALUES ('a', 'b', 'c');

import type { NextApiRequest, NextApiResponse } from 'next'
import { valideateInviteCode } from '../../../components/invite';
import { randomBytes, pbkdf2Sync } from "crypto"
import executeQuery from '../../../components/mysql';

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        let { password, inviteCode, username } = JSON.parse(req.body)

        if (!await valideateInviteCode(inviteCode)) { return resolve(res.status(200).json(false)) }

        const salt = randomBytes(16).toString('hex')
        const hash = pbkdf2Sync(password, salt, 1000, 64, `sha512`).toString(`hex`);

        executeQuery("INSERT INTO `users` (`username`, `password`, `salt`) VALUES (?, ?, ?);", [username, hash, salt]).then(resp => {
            executeQuery("UPDATE `ossia`.`invites` SET `user` = ? WHERE (`code` = ?);", [username, inviteCode])
            resolve(res.status(200).json(true))
        })
    })
}
