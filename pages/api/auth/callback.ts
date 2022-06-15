// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { load } from 'ts-dotenv'
import superagent from 'superagent'
import { setCookies } from 'cookies-next'
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
    res: NextApiResponse<object>
) {
    const token = req.query['token']
    superagent.get(apiroot)
        .query(genSig({
            'method': 'auth.getSession',
            'api_key': env.LASTFM_KEY,
            'token': token,
        },env))
        .parse(parser)
        .end((err, resp) => {
            if (err) { return console.log(err); }
            setCookies('auth', resp.body, {req,res,path: '/',maxAge: 365*24*60*60})
            res.redirect((env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ossia.ml') + "/lastfm",)
        })
}
