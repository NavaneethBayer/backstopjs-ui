import { configGenerator } from './config-generator'
// Get available sites to generate the config file
const siteConfigs = [{
    sitemapUrl: "https://space.bayer.es/sitemap-0.xml",
    sitemapType:  "xml",
    referenceDomain: "https://prodasrzyzsb.gatsbyjs.io",
    domain: "wsf-nxg-fe-next.vercel.app",
    fileName: 'bayer-es'
}];

(async () => {
    siteConfigs.map(async (siteConfig) => {
        await configGenerator(siteConfig)
    })
})();
