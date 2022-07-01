import { useEffect, useState } from "react"

const fetchApiRoots: any = async () => {
    let instances: Array<any> = []
    const body = await (await fetch("https://raw.githubusercontent.com/wiki/TeamPiped/Piped-Frontend/Instances.md")).text()
    var skipped = 0;
    const lines = body.split("\n");
    for (const line of lines) {
        const split = line.split("|");
        if (split.length == 5) {
            if (skipped < 2) {
                skipped++;
                continue;
            }
            instances.push({
                name: split[0].trim(),
                apiurl: split[1].trim(),
                locations: split[2].trim(),
                cdn: split[3].trim(),
            })
        }
    }
    return instances
}

export const usePiped = () => {
    const [apiRoot, setTheApiRoot] = useState<any>("https://pipedapi.moomoo.me")

    async function api(method: "streams" | "search", options: any) {
        const [result, setResult] = useState<any>()
        switch (method) {
            case 'search':
                return await (await fetch(`${apiRoot}/search?q=${encodeURIComponent(options["q"])}&filter=all`)).json()
            case 'streams':
                return await (await fetch(`${apiRoot}/streams/${options["v"]}`)).json()
        }
    }

    return { 'api': api }
}