// SELECT code FROM invites WHERE `order` REGEXP '/8X183226J4596163Y$';
import type { NextApiRequest, NextApiResponse } from 'next'
import executeQuery from "../../components/mysql"

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        executeQuery("SELECT code FROM invites WHERE `order` REGEXP " + `'/${JSON.parse(req.body)['i']}$'`).then(resp => {
            if (resp[0]) {
                resolve(res.status(200).json(resp[0].code))
            } else {
                resolve(res.status(200).json(false))
            }
        })
    })
}
