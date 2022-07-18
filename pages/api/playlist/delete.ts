import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const { username } = getJWT(req, res)
        const { id } = JSON.parse(req.body)
        executeQuery("SELECT author FROM playlists WHERE (`id` = ?);", [id]).then(resp => {
            if (resp[0].author === username) {
                executeQuery("call DeletePlaylistId (?)", [id]).then(() => {
                    return resolve(res.status(200).json(true))
                })
            } else {
                return resolve(res.status(200).json(false))
            }
        })
    })
}
