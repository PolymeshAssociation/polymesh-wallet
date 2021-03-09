import path from 'path';
import puppeteer from 'puppeteer';

describe('Wallet', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let extensionUrl: string;

  beforeAll(async () => {
    jest.setTimeout(30000);

    const pathToExtension = path.join(__dirname, '../packages/extension/build');

    browser = await puppeteer.launch({ headless: false,
      executablePath: process.env.PUPPETEER_EXEC_PATH,
      args: [
        '--no-sandbox', // to get around this issue https://github.com/puppeteer/puppeteer/issues/3698
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ] });

    const targets = await browser.targets();
    const backgroundPageTarget: any = targets.find((target) => target.type() === 'background_page');

    if (backgroundPageTarget._targetInfo.url) {
      const [,, extensionID] = backgroundPageTarget._targetInfo.url.split('/');

      extensionUrl = `chrome-extension://${extensionID}/index.html`;
      console.log('>>>> extensionUrl', extensionUrl);

      page = await browser.newPage();
      await page.goto(extensionUrl);
    } else {
      throw new Error('Unable to find extension URL');
    }
  });

  afterAll(async () => {
    await page.close();
    await browser.close();
  });

  describe('Account creation', () => {
    describe('Import seed phrase', () => {
      const accountName = 'Imported From Seed';
      const accountPass = 'j457fkw72jfg89';

      it('Accept agreement checkboxes', async () => {
        await page.waitForSelector('div#agreement-checkboxes', { visible: true });

        await page.evaluate(() => {
          document.querySelectorAll('input[type=checkbox]').forEach((el) => {
            if (el.parentElement) {
              el.parentElement.click();
            }
          });
        });
      });

      it('Proceed with importing seed phrase', async () => {
        await (await page.waitForXPath("//button[contains(., 'Restore account with recovery phrase')]")).click();
      });

      it('Fill import seed form', async () => {
        const seed = 'wash mosquito come blur bonus guard scissors anchor valid gadget deposit file';

        await (await page.waitForXPath('//textarea')).type(seed);
        await (await page.waitForXPath("//button[contains(., 'Continue')]")).click();
        await (await page.waitForXPath("//input[@placeholder='Enter account name']")).type(accountName);
        await (await page.waitForXPath("//input[@placeholder='Enter 8 characters or more' or @placeholder='Enter your current wallet password']")).type(accountPass);
        await (await page.waitForXPath("//input[@placeholder='Confirm your password']")).type(accountPass);
        await (await page.waitForXPath("//button[contains(., 'Restore')]")).click();
      });

      it('Account is displayed in accounts list', async () => {
        await page.waitForXPath(`//span[text()='${accountName}']`);
      });
    });
  });
});
