import type { NextApiRequest, NextApiResponse } from 'next'
import manifest from "../../manifest"

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<any>
) {
  res.status(200).json(manifest)
}
