import type { NextApiRequest, NextApiResponse } from 'next'
import { genSig, apiroot } from '../../components/lastfm'
import manifest from "../../manifest"
import superagent from "superagent"
const parser = require('superagent-xml2jsparser')
require("dotenv").config()

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    if (!req.body) { res.status(200).json({}) }
    let params = { ...(req.method === "POST" ? JSON.parse(req.body) : req.query), 'api_key': process.env.LASTFM_KEY }
    delete params.method
    params = {...params,...params.options}
    delete params.options
    params = genSig(params,true,process.env)
    switch (req.method) {
        case 'GET':
            superagent.get(apiroot)
                .query(params)
                .buffer(false)
                .parse(parser)
                .end((err, resp) => {
                    if (err) { console.log(err) }
                    res.status(200).json(resp.body)
                })
            break
        case 'POST':
            superagent.post(apiroot)
                .send((new URLSearchParams(params)).toString())
                .parse(parser)
                .set('Content-Type', 'application/x-www-form-urlencoded')
                .end((err, resp) => {
                    if (err) { console.log(err) }
                    res.status(200).json(resp.body)
                })
            break
    }
}