import { albumInfo } from "./lastfm"

export const albumArt = (artist: string, album: string) => {
    return new Promise(async (resolve, reject) => {
        const info: any = await albumInfo({ artist, album })
        if (info.lfm.$.status === "failed") { return resolve(false) }
        return resolve(info.lfm.album[0].image[info.lfm.album[0].image.length - 1]['_'])
    })
}