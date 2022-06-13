// Next.js API route support: https://nextjs.org/docs/api-routes/introduction
import type { NextApiRequest, NextApiResponse } from 'next'
const sendmail = require('sendmail')({
    logger: {
      debug: console.log,
      info: console.info,
      warn: console.warn,
      error: console.error
    },
    silent: true,
    devPort: 1025, // Default: False
    devHost: 'ossia.ml', // Default: localhost
    smtpPort: 2525, // Default: 25
    smtpHost: 'ossia.ml' // Default: -1 - extra smtp host after resolveMX
  })

export default async function handler(
    req: any,
    res: NextApiResponse<any>
) {
    sendmail({
        from: 'no-reply@ossia.ml',
        to: 'sonkolyw@gmail.com',
        subject: 'test sendmail',
        html: 'Mail of test sendmail ',
      }, function(err:any, reply:any) {
        console.log(err && err.stack);
        res.status(200).json(reply)
    });
}
