// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as yt from 'youtube-search-without-api-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const rb = JSON.parse(req.body)
  res.status(200).json(await yt.search(rb.query))
}
