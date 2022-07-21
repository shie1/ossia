import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const jwt = getJWT(req,res)
        if (!jwt) { return resolve(res.status(200).json(false)) }
        executeQuery("SELECT * FROM `playlists` WHERE (`author` = ?)", [jwt.username]).then(resp => {
            return resolve(res.status(200).json(resp))
        })
    })
}
