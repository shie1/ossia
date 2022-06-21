// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as yt from 'youtube-search-without-api-key';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  const rb = JSON.parse(req.body)
  const keywords = [rb.author.name, "song"]
  let query = keywords.join(" ").split(" ")
  query = Array.from(new Set(query))
  query = query.splice(0,query.length >= 10 ? 10 : query.length)
  console.log(query)
  let results = await yt.search(query.join(" "))
  results = results.filter((result:any) => result.id.videoId != rb.videoId)
  res.status(200).json(results.length !== 0 ? results : [false])
}
