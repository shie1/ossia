import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'
import { recognize } from '../../../components/yt'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        const { username } = getJWT(req, res)
        const { videoid, playlistid } = JSON.parse(req.body)
        executeQuery("SELECT author FROM playlists WHERE (`id` = ?);", [playlistid]).then(async resp => {
            if (resp[0]) {
                if (resp[0].author === username) {
                    const [{ SONG, ARTIST, ALBUMART }] = await recognize(videoid) as any
                    executeQuery("INSERT INTO `ossia`.`playlist-" + playlistid + "` (`title`, `author`, `image`, `id`) VALUES (?,?,?,?);", [SONG, ARTIST, ALBUMART, videoid]).then((resp) => {
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
