import fs from "fs/promises";
import path from "path";
import fetch from "node-fetch";
import { chromium } from "playwright";
import fse from "fs-extra";

import defaultConfig from "../backstop-default.json" assert { type: "json" };
import germanyCookies from "../space-bayer-de-cookies.json" assert { type: "json" };

export const JSON_API_ENDPOINT = "/api/bayer-pharma-core/valid-paths";

async function fetchCookiesFromUrl(urls, referenceDomain) {
  const url = "https://" + referenceDomain + urls[0];
  console.log('fetching cookies from ', url)
  const browser = await chromium.launch();
  const context = await browser.newContext();
  try {

    const page = await context.newPage();
    await page.goto(url);
    const cookies = await context.cookies();
    return cookies;
  } catch (error) {
    console.error("Error fetching cookies:", error);
  } finally {
    await browser.close();
  }
}

async function getUrlsFromJsonApi(referenceDomain) {
  const sitemapUrl = "https://" + referenceDomain + JSON_API_ENDPOINT;

  try {
    const { paths } = await fetch(sitemapUrl).then((res) => res.json());
    return paths;
  } catch (error) {
    console.error("Error fetching JSON API:", error);
    return [];
  }
}

export const configGenerator = async (config) => {
  const { referenceDomain, name, domain, fileName } = config;
  let urls = [];

  urls = await getUrlsFromJsonApi(referenceDomain);

  if (urls.length === 0) {
    console.error("No URLs found. Exiting configuration generation.");
    return;
  }

  // Set cookies for the website
  const cookiePath = `backstop_data/${name}/engine_scripts/cookies.json`;
  // const cookies = await fetchCookiesFromUrl(urls, referenceDomain);
  // Adding cookies for German site
  const cookies = germanyCookies;

  const scriptDir = new URL(".", import.meta.url).pathname;
  const directoryPath = path.join(
    scriptDir,
    "..",
    "backstop_data",
    name,
    "engine_scripts"
  );

  // Move the engine scripts specific to the website
  const libDirectoryPath = path.resolve(
    scriptDir,
    "..",
    "backstop_data",
    "engine_scripts"
  );
  const destinationPath = path.join(directoryPath);
  await fs.mkdir(libDirectoryPath, { recursive: true });
  await fse.copy(libDirectoryPath, destinationPath);

  // Move website cookies to correct location
  await fs.mkdir(directoryPath, { recursive: true });
  const filePath = path.join(directoryPath, "cookies.json");
  await fs.writeFile(filePath, JSON.stringify(cookies, null, 2));
  console.log("Cookies saved to", filePath);

  const scenarios = urls.map((url, index) => {
    // if json append the referencedomain with url
    let urlValue = url;
    let refUrl = url;

    urlValue = "https://" + domain + url;
    refUrl = "https://" + referenceDomain + url;

    return {
      label: `Scenario ${index + 1}`,
      url: urlValue,
      referenceUrl: refUrl,
      delay: 8000,
      cookiePath,
    };
  });

  const newConfig = {
    ...defaultConfig,
    scenarios,
    id: fileName,
    paths: {
      bitmaps_reference: `public/${name}/bitmaps_reference`,
      bitmaps_test: `public/${name}/bitmaps_test`,
      engine_scripts: `backstop_data/${name}/engine_scripts`,
      html_report: `public/${name}/report`,
      ci_report: `public/${name}/ci_report`,
      json_report: `reports/${name}`,
    },
  };

  const backstopConfig = JSON.stringify(newConfig, null, 2);

  try {
    await fs.writeFile(`${fileName}.json`, backstopConfig);
    console.log(`${fileName}.json created successfully.`);
  } catch (error) {
    console.error("Error writing BackstopJS configuration:", error);
  }
};
