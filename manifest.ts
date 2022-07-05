import fs from 'fs'
import path from "path"
import theme from './components/theme';

const pkg = JSON.parse((fs.readFileSync(path.join(process.cwd(), "package.json")) as any))
const manifest = {
    "name": "Ossia Music Player",
    "short_name": pkg.name.substring(0, 1).toUpperCase() + pkg.name.substring(1),
    "author": pkg.author,
    "version": pkg.version,
    "description": pkg.description,
    "theme_color": theme.colors[theme.primaryColor][theme.primaryShade],
    "background_color": "#141517",
    "display": "standalone",
    "orientation": "portrait",
    "scope": "/",
    "id": "/",
    "icons": [
        {
            "src": "/ossia_circle.png",
            "sizes": "3000x3000",
            "type": "image/png"
        }
    ],
    "start_url": "/",
    "lang": "en-US",
    "splash_pages": null
}
export default manifest;