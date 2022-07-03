// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'ts-dotenv'
import superagent from 'superagent'
import { apiroot } from '../../../components/lastfm'
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
    console.log(JSON.parse(req.body))
    superagent.get(apiroot)
        .query({
            'method': 'track.search',
            'api_key': env.LASTFM_KEY,
            ...JSON.parse(req.body)
        })
        .parse(parser)
        .buffer(true)
        .end((err,resp) => {
            if(err){console.log(err)}
            res.status(200).json(resp.body)
        })
}
