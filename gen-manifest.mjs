import fs from 'fs'
import path from 'path'

const pkg = require('./package.json');
const manifest = {
    "name": "Ossia Music Player",
    "short_name": "Ossia",
    "author": pkg.author,
    "version": pkg.version,
    "theme_color": "#1971C2",
    "background_color": "#1A1B1E",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "start_url": "/",
    "lang": "en-US",
    "icons": [
        {
            "src": "/ossia.png",
            "sizes": "3000x3000",
            "type": "image/png"
        }
    ],
    "splash_pages": null
}

fs.writeFileSync(path.join(process.cwd(), "public/manifest.json"),JSON.stringify(manifest))

export default manifest;