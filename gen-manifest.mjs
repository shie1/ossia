import fs from 'fs'
import path from 'path'

const pkg = JSON.parse(fs.readFileSync(path.join(process.cwd(), "package.json")))
const manifest = {
    "name": "Ossia Music Player",
    "short_name": "Ossia",
    "author": pkg.author,
    "version": pkg.version,
    "description": pkg.description,
    "theme_color": "#590288",
    "background_color": "#1A1B1E",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "id": "/",
    "start_url": "/",
    "lang": "en-US",
    "icons": [
        {
            "src": "/ossia_rect.png",
            "sizes": "3000x3000",
            "type": "image/png"
        }
    ],
    "splash_pages": null
}

export default manifest;