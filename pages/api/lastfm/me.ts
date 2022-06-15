// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'ts-dotenv'
import superagent from 'superagent'
import { getCookie } from 'cookies-next'
import { apiroot } from '../../../functions'
const parser = require('superagent-xml2jsparser')

const env = load({
    LASTFM_KEY: String,
    LASTFM_SECRET: String,
    NODE_ENV: [
        'production' as const,
        'development' as const,
    ],
})

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    const user = JSON.parse(getCookie('auth',{req,res}) as any)
    const username = user.lfm.session[0].name[0]
    superagent.get(apiroot)
        .query({
            'method': 'user.getInfo',
            'api_key': env.LASTFM_KEY,
            'user': username
        })
        .parse(parser)
        .end((err,resp) => {
            res.status(200).json(resp.body)
        })
}
