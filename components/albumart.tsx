import { albumInfo } from "./lastfm"

export const albumArt = (artist: string, album: string) => {
    return new Promise(async (resolve, reject) => {
        const info: any = await albumInfo({ artist, album })
        if (info.lfm.$.status === "failed") { return resolve(false) }
        const art = info.lfm.album[0].image[info.lfm.album[0].image.length - 1]['_']
        const resolution = /[0-9]*x[0-9]*/
        return resolve(resolution.test(art) ? art.replace(resolution, '800x800') : art)
    })
}