import fs from 'fs'
import path from "path"

const pkg = JSON.parse((fs.readFileSync(path.join(process.cwd(), "package.json")) as any))
const manifest = {
    "name": "Ossia Music Player",
    "short_name": pkg.name.substring(0, 1).toUpperCase() + pkg.name.substring(1),
    "author": pkg.author,
    "version": pkg.version,
    "version_name": pkg.version,
    "description": pkg.description,
    "theme_color": "#8C48A9",
    "background_color": "#141517",
    "display": "minimal-ui",
    "orientation": "portrait",
    "scope": "/",
    "id": "/",
    "icons": [
        {
            "src": "/api/img/ossia_circle.png?s=48",
            "sizes": "48x48",
            "type": "image/png"
        },
        {
            "src": "/api/img/ossia_circle.png?s=72",
            "sizes": "72x72",
            "type": "image/png"
        },
        {
            "src": "/api/img/ossia_circle.png?s=96",
            "sizes": "96x96",
            "type": "image/png"
        },
        {
            "src": "/api/img/ossia_circle.png?s=144",
            "sizes": "144x144",
            "type": "image/png"
        },
        {
            "src": "/api/img/ossia_circle.png?s=168",
            "sizes": "168x168",
            "type": "image/png"
        },
        {
            "src": "/api/img/ossia_circle.png?s=192",
            "sizes": "192x192",
            "type": "image/png"
        }
    ],
    "start_url": "/",
    "lang": "en-US",
    "splash_pages": null
}
export default manifest;