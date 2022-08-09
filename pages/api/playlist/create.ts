import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        const jwt = getJWT(req, res)
        const { playlist, icon } = JSON.parse(req.body)
        if (!jwt || !playlist || !icon) { return resolve(res.status(200).json(false)) }
        executeQuery("call CreatePlaylist (?,?,?,@id);SELECT @id;", [playlist, jwt.username, icon]).then((resp) => {
            if (!resp.error) {
                return resolve(res.status(200).json(true))
            } else {
                return resolve(res.status(200).json(false))
            }
        })
    })
}
