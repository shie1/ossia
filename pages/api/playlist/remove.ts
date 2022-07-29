import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        const { username } = getJWT(req, res)
        const { playlistid, index } = JSON.parse(req.body)
        executeQuery("SELECT author FROM playlists WHERE (`id` = ?);", [playlistid]).then(async resp => {
            if (resp[0]) {
                if (resp[0].author === username) {
                    executeQuery("DELETE FROM `ossia`.`playlist-" + playlistid + "` WHERE (`index` = ?);", [index]).then(() => {
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
