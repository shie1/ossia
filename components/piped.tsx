export const apiroot = "https://pipedapi.kavin.rocks"

export const search = (rb: any) => {
    return new Promise(async (resolve, reject) => {
        let np = ""
        if (rb["nextpage"]) {
            np = "nextpage/"
        }
        const params = new URLSearchParams(rb as any).toString()
        let resp
        try { resp = await (await fetch(`${apiroot}/${np}search?${params}`)).json() } catch { resp = {} }
        resolve(resp)
    })
}