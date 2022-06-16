// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import manifest from '../../gen-manifest.mjs'

export default async function handler(
    req: any,
    res: NextApiResponse<object>
) {
    console.log(manifest)
    res.status(200).json(manifest)
}
