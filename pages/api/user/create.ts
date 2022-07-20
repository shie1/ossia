// INSERT INTO `ossia`.`users` (`username`, `password`, `salt`) VALUES ('a', 'b', 'c');

import type { NextApiRequest, NextApiResponse } from 'next'
import { valideateInviteCode } from '../../../components/invite';
import { randomBytes, pbkdf2Sync } from "crypto"
import executeQuery from '../../../components/mysql';

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
    return new Promise(async (resolve, reject) => {
        let rb = JSON.parse(req.body)
        rb.password = caesar(rb.password, -Number(`${(new Date().getDate())}67${(new Date().getMonth())}`))

        if (!await valideateInviteCode(rb.inviteCode)) { return resolve(res.status(200).json(false)) }

        const salt = randomBytes(16).toString('hex')
        const hash = pbkdf2Sync(rb.password, salt, 1000, 64, `sha512`).toString(`hex`);

        executeQuery("INSERT INTO `users` (`username`, `password`, `salt`) VALUES (?, ?, ?);", [rb.username, hash, salt]).then(resp => {
            executeQuery("UPDATE `ossia`.`invites` SET `user` = ? WHERE (`code` = ?);", [rb.username, rb.inviteCode])
            resolve(res.status(200).json(true))
        })
    })
}
