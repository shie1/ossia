import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        const { username } = getJWT(req, res)
        let { plpublic, id } = JSON.parse(req.body)
        console.log(plpublic)
        plpublic = plpublic ? 1 : 0
        console.log(plpublic)
        executeQuery("SELECT author FROM playlists WHERE (`id` = ?);", [id]).then(async resp => {
            if (resp[0]) {
                if (resp[0].author === username) {
                    executeQuery("UPDATE `ossia`.`playlists` SET `ispublic` = ? WHERE (`id` = ?);", [plpublic, id]).then(() => {
                        return resolve(res.status(200).json(true))
                    })
                } else {
                    return resolve(res.status(200).json(false))
                }
            } else {
                return resolve(res.status(200).json(false))
            }
        })
    })
}
