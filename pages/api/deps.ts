import type { NextApiRequest, NextApiResponse } from 'next'
import fs from "fs"
import path from "path"
const pkg = JSON.parse((fs.readFileSync(path.join(process.cwd(), "package.json")) as any))

export default function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    res.status(200).json(pkg.dependencies)
}
