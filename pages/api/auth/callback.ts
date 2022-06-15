// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import md5 from 'md5'
import { load } from 'ts-dotenv'
import superagent from 'superagent'

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
    res: NextApiResponse<object>
) {
    const token = req.query['token']
    const apiroot = "http://ws.audioscrobbler.com/2.0/"
    const sig = md5(`api_key${env.LASTFM_KEY}methodauth.getSessiontoken${token}`)
    superagent.get(apiroot)
        .query({
            'method': 'auth.getSession',
            'api_key': env.LASTFM_KEY,
            'token': token,
            'api_sig': sig
        })
        .end((err, resp) => {
            if (err) { return console.log(err); }
            res.status(200).send(resp.body)
        })
}
