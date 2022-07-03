import fs from 'fs'
import path from "path"

const pkg = JSON.parse((fs.readFileSync(path.join(process.cwd(), "package.json")) as any))
const manifest = {
    "name": "Ossia Music Player",
    "short_name": pkg.name.substring(0,1).toUpperCase()+pkg.name.substring(1),
    "author": pkg.author,
    "version": pkg.version,
    "description": pkg.description,
    "theme_color": "#9E5DB9",
    "background_color": "#141517",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "id": "/",
    "start_url": "/",
    "lang": "en-US",
    "splash_pages": null
}
export default manifest;