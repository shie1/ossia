import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../components/mysql'
import { getJWT } from '../../../components/jwt'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        let playlist: any = {}
        const { id } = JSON.parse(req.body)
        executeQuery("SELECT * FROM playlists WHERE (`id` = ?)", [id]).then(resp => {
            resp = resp[0]
            if (resp["ispublic"] === 0) {
                const { username } = getJWT(req, res)
                if (resp.author !== username) { return resolve(res.status(200).json(false)) }
            }
            playlist = { "name": resp.name, "icon": resp["icon_name"], author: resp["author"], ispublic: resp["ispublic"] !== 0, content: [] }
            executeQuery("SELECT * FROM `playlist-" + id + "`").then(respC => {
                for (const song of respC) {
                    playlist.content.push(song)
                }
                return resolve(res.status(200).json(playlist))
            })
        })
    })
}
