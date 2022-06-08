// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import xml2js from "xml2js"
import path from "path"

const fsPromises = fs.promises;

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    const xml = await fsPromises.readFile(path.join(process.cwd(),"public/rss.xml"), "utf-8")
    xml2js.parseString(xml, (err, data) => {
        if(!req.query.p){
            res.status(200).json(data)
        }
    })
}
