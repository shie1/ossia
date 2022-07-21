// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next';
import superagent from 'superagent'
import { setCookies } from 'cookies-next'
import { apiroot, genSig } from '../../../components/lastfm'
const parser = require('superagent-xml2jsparser')
require("dotenv").config()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<object>
) {
    const token = req.query['token']
    superagent.get(apiroot)
        .buffer(true)
        .query(genSig({
            'method': 'auth.getSession',
            'api_key': process.env.LASTFM_KEY,
            'token': token,
        }, true, process.env))
        .parse(parser)
        .end((err, resp) => {
            if (err) { return console.log(err); }
            setCookies('auth', resp.body, { req, res, path: '/', maxAge: 365 * 24 * 60 * 60 })
            res.redirect((process.env.NODE_ENV === 'development' ? 'http://localhost:3000' : 'https://ossia.ml') + "/user",)
        })
}