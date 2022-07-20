import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from '../../../components/mysql'

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        return resolve(res.status(200).json(true))
        const { id } = JSON.parse(req.body)
        executeQuery("INSERT INTO `ossia`.`playlist-14` (`title`, `author`, `image`, `id`) VALUES (?,?,?,?);")
    })
}
