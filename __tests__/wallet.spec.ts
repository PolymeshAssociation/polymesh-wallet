import puppeteer from 'puppeteer';
import path from 'path';
import { mnemonicGenerate } from '@polkadot/util-crypto';

async function clickOn (page: puppeteer.Page, menuItem: string) {
  // @ts-ignore
  await page.evaluate(() => document.querySelector('#add_account_menu').parentElement.click());

  await (await page.waitForXPath(`//span[text()='${menuItem}']`))
    .click();
}

describe('Wallet', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let extensionUrl: string;
  const accountPass = 'j457fkw72jfg89';
  const jsonPass = 'JSONPASS0';
  const jsonFilePath = path.join(__dirname, 'json_account.json');
  const SEED_WORDS = 12;

  beforeAll(async () => {
    const pathToExtension = path.join(__dirname, '../packages/extension/build');

    browser = await puppeteer.launch({ dumpio: true,
      headless: false,
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

      const context = browser.defaultBrowserContext();

      await context.overridePermissions(extensionUrl, ['clipboard-read']);

      page = await browser.newPage();
      await page.goto(extensionUrl);
    } else {
      throw new Error('Unable to find extension URL');
    }
  });

  // afterAll(async () => {
  //   await page.close();
  //   await browser.close();
  // });

  describe('Accounts', () => {
    describe('Agreements', () => {
      it('Accept agreement checkboxes', async () => {
        await page.waitForSelector('input[type=checkbox]');

        await page.evaluate(() =>
          document.querySelectorAll('input[type=checkbox]').forEach((el) => {
            if (el.parentElement) {
              el.parentElement.click();
            }
          })
        );
      });
    });

    describe('Create new account', () => {
      const accountName = 'New Account';

      it('Proceed with account creation', async () => {
        await (await page.waitForXPath('//button[text()="Create new account"][not(@disabled)]')).click();
      });

      it('Generate and confirm seed', async () => {
        await (await page.waitForXPath("//span[text()='Copy your recovery phrase']")).click();

        const copiedPhrase = await page.evaluate(() => navigator.clipboard.readText());
        const words = copiedPhrase.split(' ');

        expect(words.length).toEqual(SEED_WORDS);

        await page.evaluate(() =>
          document.querySelectorAll('input[type=checkbox]').forEach((el) => {
            if (el.parentElement) {
              el.parentElement.click();
            }
          })
        );

        await (await page.waitForXPath("//button[text()='Continue'][not(@disabled)]"))
          .click();

        const div = await page.waitForSelector('#shuffled-phrase');

        for (const word of words) {
          const el = (await div.$x(`//span[text()="${word}"]`))[0];

          await el.click();
        }

        await page.waitForXPath('//span[text()="Your recovery phrase is correct. Thank you!"]');

        await (await page.waitForXPath("//button[text()='Continue'][not(@disabled)]"))
          .click();
      });

      it('Set account details', async () => {
        await (await page.waitForXPath("//input[@placeholder='Enter account name']"))
          .type(accountName);

        await (await page.waitForXPath("//input[@placeholder='Enter 8 characters or more']"))
          .type(accountPass);

        await (await page.waitForXPath("//input[@placeholder='Confirm your password']"))
          .type(accountPass);

        await (await page.waitForXPath("//button[text()='Create account'][not(@disabled)]"))
          .click();
      });

      it('Account is displayed in accounts list', async () => {
        await page.waitForXPath(`//span[text()='${accountName}']`);
      });
    });

    describe('Import seed phrase', () => {
      const accountName = 'Imported From Seed';

      it('Can add additional keys', async () => {
        await page.waitForSelector('#add_account_menu');

        await clickOn(page, 'Restore with recovery phrase');
      });

      it('Fill import seed form', async () => {
        const seed = mnemonicGenerate(SEED_WORDS);

        await (await page.waitForXPath('//textarea'))
          .type(seed);

        await (await page.waitForXPath("//button[text()='Continue'][not(@disabled)]"))
          .click();
      });

      it('Fill account details', async () => {
        await (await page.waitForXPath("//input[@placeholder='Enter account name']"))
          .type(accountName);

        await (await page.waitForXPath("//input[@placeholder='Enter wallet password']"))
          .type(accountPass);

        await (await page.waitForXPath("//button[text()='Restore'][not(@disabled)]")).click();
      });

      it('Account is displayed in accounts list', async () => {
        await page.waitForXPath(`//span[text()='${accountName}']`);
      });
    });

    describe('Import from JSON', () => {
      const accountName = 'Imported from JSON';

      it('Can add additional keys', async () => {
        await clickOn(page, 'Import account with JSON file');
      });

      it('Can upload JSON file', async () => {
        await page.waitForXPath("//input[@type='file']", { hidden: true });

        const uploadHandle = (await page.$x("//input[@type='file']"))[0];

        await uploadHandle.uploadFile(jsonFilePath);

        await uploadHandle.evaluate((upload) =>
          upload.dispatchEvent(new Event('change', { bubbles: true })));

        const passHandle = await page.waitForSelector('input#jsonPassword');

        expect((await page.$x("//input[@type='password']")).length).toEqual(1);

        const submitHandle = (await page.$x("//button[@type='submit']"))[0];

        expect(submitHandle).toBeTruthy();

        await passHandle.type(accountPass);
        await submitHandle.click();
        await page.waitForXPath('//span[text()="Invalid password"]');

        await page.evaluate(() => {
          // @ts-ignore
          document.querySelector('input#jsonPassword').value = '';
        });
        await passHandle.type(jsonPass);
        await submitHandle.click();
      });

      it('Prompt for wallet password', async () => {
        await (await page.waitForXPath("//input[@placeholder='Enter wallet password']"))
          .type(accountPass);

        await (await page.waitForXPath("//button[@type='submit']"))
          .click();
      });

      it('Account is displayed in accounts list', async () => {
        await page.waitForXPath(`//span[text()='${accountName}']`);
      });
    });
  });
});
