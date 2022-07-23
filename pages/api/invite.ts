// INSERT INTO `invites` (`code`) VALUES ('value');
import type { NextApiRequest, NextApiResponse } from 'next'
import { md5 } from '../../components/lastfm'
import excuteQuery from '../../components/mysql'
require("dotenv").config()

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const rb = JSON.parse(req.body)
        if (!rb['details']) { return resolve(res.status(500).json(false)) }
        if (!(new URL(JSON.parse(rb["details"]).links[0].href)).hostname.endsWith("paypal.com")) { return resolve(res.status(500).json(false)) }
        const resp = await (await fetch(JSON.parse(rb["details"]).links[0].href, {
            headers: {
                "Authorization": `Basic ${Buffer.from(`${process.env["PAYPAL_ID"]}:${process.env["PAYPAL_SECRET"]}`).toString("base64")}`,
            }
        })).json()
        if (resp.status === 'COMPLETED') {
            const plain = `ossia-invite-code:${(new Date()).getTime()}`
            const hash = md5(plain).substring(0, 8)
            excuteQuery("INSERT INTO `invites` (`code`,`order`) VALUES " + `('${hash}','${resp.links[0].href}');`).then(result => {
                console.log(result)
                resolve(res.status(200).json([hash, resp.id]))
            })
        } else {
            resolve(res.status(500).json(false))
        }
    })
}
