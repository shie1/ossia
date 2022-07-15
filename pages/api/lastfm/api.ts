import type { NextApiRequest, NextApiResponse } from 'next'
import { genSig, apiroot } from '../../../components/lastfm'
import superagent from "superagent"
const parser = require('superagent-xml2jsparser')
require("dotenv").config()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    return new Promise((resolve, reject) => {
        if (!req.body) { resolve(res.status(200).json({})) }
        let params = { ...(req.method === "POST" ? JSON.parse(req.body) : req.query), 'api_key': process.env.LASTFM_KEY }
        delete params.method
        params = { ...params, ...params.options }
        delete params.options
        params = genSig(params, true, process.env)
        switch (req.method) {
            case 'GET':
                superagent.get(apiroot)
                    .query(params)
                    .buffer(true)
                    .parse(parser)
                    .end((err, resp) => {
                        if (err) { console.log(err) }
                        resolve(res.status(200).json(resp.body))
                    })
                break
            case 'POST':
                superagent.post(apiroot)
                    .send((new URLSearchParams(params)).toString())
                    .buffer(true)
                    .parse(parser)
                    .set('Content-Type', 'application/x-www-form-urlencoded')
                    .end((err, resp) => {
                        if (err) { console.log(err) }
                        resolve(res.status(200).json(resp.body))
                    })
                break
        }
    })
}