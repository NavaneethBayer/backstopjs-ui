import backstop from "backstopjs";
import { websites } from "../website-config.js";

(async () => {
  try {
    for (const siteConfig of websites) {
      const { fileName } = siteConfig;
      console.log(`Running test report for website ${fileName}`);
      const configFile = `${fileName}.json`;
      const options = {
        config: configFile,
      };
      try {
        await backstop("test", options);
        console.log(`Test report generation completed for website ${fileName}`);
      } catch (error) {
        console.error(`Test cases failed for website ${fileName}`);
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
