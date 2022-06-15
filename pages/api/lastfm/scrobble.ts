// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'ts-dotenv'
import superagent from 'superagent'
import { getCookie } from 'cookies-next'
import { apiroot, genSig } from '../../../functions'
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
    const sk = JSON.parse(getCookie('auth', { req, res }) as any).lfm.session[0].key[0]
    superagent.get(apiroot)
        .query({
            'method': 'track.scrobble',
            'api_key': env.LASTFM_KEY,
            'sk': sk,
            ...req.body
        })
        .parse(parser)
        .end((err, resp) => {
            res.status(200).json(resp.body)
        })
}
