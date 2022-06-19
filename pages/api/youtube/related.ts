// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as yt from 'youtube-search-without-api-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const rb = JSON.parse(req.body)
  let query = rb.keywords.join(" ").split(" ")
  query = Array.from(new Set(query))
  query = query.splice(0,query.length >= 10 ? 10 : query.length)
  let results = await yt.search(query.join(" "))
  results = results.filter((result:any) => result.id.videoId != rb.videoId)
  console.log(query,results)
  res.status(200).json(results.length !== 0 ? results : [false])
}
