import type { NextApiRequest, NextApiResponse } from 'next'
import sharp from "sharp"
import path from "path"
import fs from "fs"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  return new Promise(async (resolve, reject) => {
    let { image, s }: any = req.query
    if (s) {
      if (/^[0-9]*$/.test(s)) {
        s = Number(s)
      } else {
        return resolve(res.status(400).send(""))
      }
    }
    const imgPath = path.join(process.cwd(), "/img/", image as string)
    if (!fs.existsSync(imgPath)) { return resolve(res.status(404).send("")) }
    res.setHeader("Content-Type", `image/${(image as string).split(".")[image.split(".").length - 1]}`)
    if (s) {
      return resolve(sharp(imgPath).resize(typeof s === 'number' ? s : (s[0], s[1])).pipe(res))
    } else {
      return resolve(sharp(imgPath).pipe(res))
    }
  })
}
