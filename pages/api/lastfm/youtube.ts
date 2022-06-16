// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import * as yt from 'youtube-search-without-api-key';
import ytdl from 'ytdl-core';

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    const video = (await yt.search(`${req.query['artist']} ${req.query['track']}`))[0].url
    res.status(200).json(video)
}