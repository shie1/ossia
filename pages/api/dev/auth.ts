// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
import { getCookie } from 'cookies-next'
import { load } from 'ts-dotenv'

const env = load({
    LASTFM_KEY: String,
    LASTFM_SECRET: String,
    NODE_ENV: [
        'production' as const,
        'development' as const,
    ],
})

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    if (env.NODE_ENV == 'production') { return res.send(403) }
    const auth = getCookie('auth', { req, res })
    res.status(200).json(auth)
}
