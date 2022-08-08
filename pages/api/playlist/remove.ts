import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        return resolve(false) // W.I.P.
        const { username } = getJWT(req, res)
        const { id, index } = JSON.parse(req.body)
        executeQuery("SELECT author FROM playlists WHERE (`id` = ?);", [id]).then(async resp => {
            if (resp[0]) {
                if (resp[0].author === username) {
                    executeQuery("DELETE FROM `ossia`.`playlist-" + id + "` WHERE (`index` = ?);", [index]).then(() => {
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
