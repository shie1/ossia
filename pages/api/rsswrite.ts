// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import xml2js from "xml2js"
import path from "path"

const rfc: any = require("rfc822-date")
const fsPromises = fs.promises;

const prepend = (value: any, array: any) => {
    console.log(Array.from(array))
    return [value, ...Array.from(array)];
}

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    const rb = req.body
    if(rb.password != 'OpLkÉá123!'){return res.status(500)}
    const xml = await fsPromises.readFile(path.join(process.cwd(), "public/rss.xml"), "utf-8")
    xml2js.parseString(xml, (err, data) => {
        console.log(data.rss.channel[0].item)
        data.rss.channel[0].item.push({
            "title": [rb.title],
            "guid": [`https://ossia.ml/post?p=${data.rss.channel[0].item.length}`],
            "category": [rb.category],
            "description": [rb.content],
            "pubDate": [rfc(new Date())]
        })
        const builder = new xml2js.Builder();
        const xml = builder.buildObject(data);
        fs.writeFile(path.join(process.cwd(), "public/rss.xml"), xml, () => {
            res.status(200).json(true)
        })
    })
}
