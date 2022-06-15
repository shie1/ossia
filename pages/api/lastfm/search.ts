// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'ts-dotenv'
import superagent from 'superagent'
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
    superagent.get(apiroot)
        .query({
            'method': 'track.search',
            'api_key': env.LASTFM_KEY,
            ...JSON.parse(req.body)
        })
        .parse(parser)
        .end((err,resp) => {
            res.status(200).json(resp.body)
        })
}
