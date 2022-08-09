import type { NextApiRequest, NextApiResponse } from 'next'
import { getJWT } from '../../../components/jwt'
import executeQuery from '../../../components/mysql'
import { search } from '../../../components/piped'
import { recognize } from '../../../components/yt'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise(async (resolve, reject) => {
        const jwt = getJWT(req, res)
        const { plName, icon, importUrl, importPlatform } = JSON.parse(req.body)
        if (!jwt || !plName || !icon || !importUrl || typeof importPlatform === 'undefined') { return resolve(res.status(200).json(false)) }
        let recog: any = await recognize(importUrl);
        const plContent = await Promise.all((recog as Array<any>).map(async song => {
            const sResp: any = await search({ "filter": "videos", "q": `${song.ARTIST} ${song.SONG}` })
            const id = sResp.items[0].url.split("?v=")[1]
            return { ...song, id }
        }))
        executeQuery("call CreatePlaylist (?,?,?,@id);SELECT @id;", [plName, jwt.username, icon]).then(async (resp) => {
            if (!resp.error) {
                const playlistid = resp[1][0]['@id']
                let queryString = "INSERT INTO `ossia`.`playlist-" + playlistid + "` (`title`, `author`, `image`, `id`) VALUES "
                const rows = []
                for (let song of plContent) {
                    rows.push(`(${[`'${song.SONG}'`, `'${song.ARTIST}'`, `'${song.ALBUMART}'`, `'${song.id}'`].join(",")})`)
                }
                queryString = queryString + rows.join(',') + ";"
                executeQuery(queryString).then(resp2 => {
                    if (!resp2.error) {
                        return resolve(res.status(200).json(true))
                    } else {
                        return resolve(res.status(200).json(false))
                    }
                })
            } else {
                return resolve(res.status(200).json(false))
            }
        })
    })
}
