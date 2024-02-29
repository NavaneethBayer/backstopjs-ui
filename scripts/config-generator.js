import fs from "fs"
import fetch from "node-fetch"
import { parseString } from "xml2js"

// const defaultConfig = require('../backstop-default.json');

export const configGenerator = async (config) => {
  const { sitemapUrl , sitemapType, referenceDomain, domain, fileName } = config
  const SITEMAP_URL = "https://space.bayer.es/sitemap-0.xml";
  const NEXT_DOMAIN = "wsf-nxg-fe-next.vercel.app"

  function getNextJsUrl(url){
     const urlParts = url.split("/");
     urlParts[2] = NEXT_DOMAIN;
     const convertedUrl = urlParts.join("/");
     return convertedUrl;
  }
  // Generate BackstopJS configuration
  function generateBackstopConfig(urls) {
    const scenarios = urls.map((url, index) => ({
      label: `Scenario ${index + 1}`,
      url: getNextJsUrl(url),
      referenceUrl: url,
      delay: 6000,
      cookiePath: "backstop_data/engine_scripts/cookies.json",
    }));
    const newConfig = { ...defaultConfig, scenarios };
    return JSON.stringify(newConfig, null, 2);
  }

  // Parse sitemap.xml and fetch the urls
  async function getUrlsFromSitemap(sitemapUrl) {
    try {
      const response = await fetch(sitemapUrl);
      const xml = await response.text();
      let urls = [];
      parseString(xml, (err, result) => {
        if (err) {
          console.error("Error parsing XML:", err);
          return;
        }

        if (result && result.urlset && result.urlset.url) {
          urls = result.urlset.url.map((url) => url.loc[0]);
        } else {
          console.error("No URLs found in the sitemap.");
          return [];
        }
      });
      return urls;
    } catch (error) {
      console.error("Error fetching sitemap:", error);
    }
  }

  const urls = await getUrlsFromSitemap(SITEMAP_URL);

  const config = generateBackstopConfig(urls);
  fs.writeFileSync("backstop-testing.json", config);
}