// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'ts-dotenv'
import superagent from 'superagent'
import { apiroot } from '../../../components/lastfm'

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
            'api_key': env.LASTFM_KEY,
            'format': 'json',
            ...JSON.parse(req.body)
        })
        .end((err,resp) => {
            res.status(200).json(resp.body)
        })
}
