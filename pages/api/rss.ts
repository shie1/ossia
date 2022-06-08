// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import rssparser from "rss-parser"

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    const parser = new rssparser()
    const rb = JSON.parse(req.body)
    res.status(200).json(await parser.parseURL(rb.rss))
}
