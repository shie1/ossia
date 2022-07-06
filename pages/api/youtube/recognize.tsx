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
    const lockups = musicSection.carouselLockups
    for (const lockup of lockups) {
        let inner: any = {}
        const renderer = lockup.carouselLockupRenderer
        if (typeof renderer.videoLockup !== 'undefined') {
            inner["SONG"] = renderer.videoLockup.compactVideoRenderer.title.runs[0].text
        }
        for (const infoRow of renderer.infoRows) {
            const title = infoRow.infoRowRenderer.title.simpleText
            let input: any = typeof infoRow.infoRowRenderer.defaultMetadata !== 'undefined' ? infoRow.infoRowRenderer.defaultMetadata : infoRow.infoRowRenderer.expandedMetadata
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
            if (input) { inner[title] = input }
        }
        resp.push(inner)
    }
    res.status(200).json(resp)
}
