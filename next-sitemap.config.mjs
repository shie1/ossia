/** @type {import('next-sitemap').IConfig} */
const config = {
    siteUrl: process.env.SITE_URL || 'https://ossia.ml',
    generateRobotsTxt: true,
}

export default config