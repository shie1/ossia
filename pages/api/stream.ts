// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import ytdl from 'ytdl-core'

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    ytdl(req.query['v'], { filter: 'audioonly', quality: req.query['q'] ? req.query['q'] : 'highestaudio' }).pipe(res)
}
