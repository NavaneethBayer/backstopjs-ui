import backstop from "backstopjs";
import { websites } from "../website-config.js";
import fs from 'fs';

function replaceTextInFile(filePath, searchText, replacementText) {
  fs.readFile(filePath, 'utf8', (err, data) => {
      if (err) {
          console.error('Error reading file:', err);
          return;
      }
      const regex = new RegExp(searchText, 'g');
      const updatedContent = data.replace(regex, replacementText);
      fs.writeFile(filePath, updatedContent, 'utf8', (err) => {
          if (err) {
              console.error('Error writing file:', err);
              return;
          }
          console.log('Replacement complete.');
      });
  });
}

(async () => {
  try {
    for (const siteConfig of websites) {
      const { fileName, name} = siteConfig;
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
      try {
        const filePath = `reports/${name}/jsonReport.json`;
        replaceTextInFile(filePath, '/public', '');
      } catch (error) {
        console.log('Failed replacing content')
      }
    }
  } catch (error) {
    console.error("An error occurred:", error);
  }
})();
