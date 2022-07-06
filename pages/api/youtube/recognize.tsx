import type { NextApiRequest, NextApiResponse } from 'next'
import ytdl from "ytdl-core"

export default async function handler(
    req: NextApiRequest,
    res: NextApiResponse<any>
) {
    let resp: Array<any> = []
    const info: any = (await ytdl.getInfo(req.query['v'] as any))
    if (typeof info.response.engagementPanels[1].engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items[1] === 'undefined') { res.status(200).json(false) }
    const musicSection = info.response.engagementPanels[1].engagementPanelSectionListRenderer.content.structuredDescriptionContentRenderer.items[1].videoDescriptionMusicSectionRenderer
    for (const lockup of musicSection.carouselLockups) {
        let innerResp: any = {}
        if (typeof lockup.carouselLockupRenderer.infoRows !== 'undefined') {
            for (const row of lockup.carouselLockupRenderer.infoRows) {
                const renderer = row.infoRowRenderer
                const title = renderer.title.simpleText
                console.log(title)
                let input: any = typeof renderer.defaultMetadata !== 'undefined' ? renderer.defaultMetadata : renderer.expandedMetadata
                switch (title) {
                    case "SONG":
                        input = input.simpleText
                        break
                    case "ARTIST":
                        input = typeof input.simpleText === 'undefined' ? input.runs[0].text : input.simpleText
                        break
                    case "LICENSES":
                        input = input.simpleText
                        break
                    case "ALBUM":
                        input = input.simpleText
                        break
                    case "WRITERS":
                        input = input.simpleText
                        break
                    default:
                        input = ""
                        break
                }
                if (input) { innerResp[title] = input }
            }
            resp.push(innerResp)
        }
    }
    res.status(200).json(resp)
}
