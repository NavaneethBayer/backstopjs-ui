import { chromium } from "playwright";
import defaultCoookies from "../default-cookies.json" assert { type: "json" };

export async function fetchCookiesFromUrl(urlPath, referenceDomain) {
  const url = "https://" + referenceDomain + urlPath;
  console.log("fetching cookies from ", url);
  const browser = await chromium.launch();
  const context = await browser.newContext();
  try {
    await context.addCookies(defaultCoookies);
    const page = await context.newPage();
    await page.goto(url);
    await page.waitForLoadState("domcontentloaded");
    let  store = await context.storageState();
    return store;
  } catch (error) {
    console.error("Error fetching cookies:", error);
  } finally {
    await browser.close();
  }
}
