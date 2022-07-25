import type { NextApiRequest, NextApiResponse } from 'next'
const date = process.env.BUILD_DATE || false

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.status(200).json(date ? new Date(date).getTime() : 0)
}
