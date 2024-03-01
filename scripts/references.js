import { websites } from '../website-config.js';
import backstop from 'backstopjs';

(async () => {
    try {
        for (const siteConfig of websites) {
            const { fileName } = siteConfig;
            console.log(`Generating references for website ${fileName}`);
            const configFile = `${fileName}.json`;
            const options = {
                config: configFile,
            };
            await backstop('reference', options);
            console.log(`Generating references completed for website ${fileName}`);
        }
    } catch (error) {
        console.error('Error generating references:', error);
    }
})();
