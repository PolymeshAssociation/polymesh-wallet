import path from 'path';
import puppeteer from 'puppeteer';

async function _c (handle: puppeteer.ElementHandle<Element>): Promise<void> {
  await handle.click({ clickCount: 3 });
  await handle.press('Backspace');
}

describe('Wallet', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let extensionUrl: string;

  const accountName = 'Imported From Seed';
  const accountPass = 'j457fkw72jfg89';

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
        await (await page.waitForXPath("//button[contains(., 'Restore account')]")).click();
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

  describe('Changing password', () => {
    const wrongCurrentPass = Math.random().toString();
    const newPass = `${accountPass}NEW`;
    const newPassNotMatch = `${accountPass}newNotMatch`;

    it('Navigate to screen', async () => {
      await (await page.waitForSelector('div.settings-menu')).click();
      await (await page.waitForXPath("//span[contains(., 'Change password')]")).click();
    });

    describe('Validates user input', () => {
      let currentPassInput: puppeteer.ElementHandle<Element>,
        newPassInput: puppeteer.ElementHandle<Element>,
        confirmPassInput: puppeteer.ElementHandle<Element>,
        submitButton: puppeteer.ElementHandle<Element>;

      beforeAll(async () => {
        currentPassInput = await page.waitForSelector('#currentPassword');
        newPassInput = await page.waitForSelector('#newPassword');
        confirmPassInput = await page.waitForSelector('#confirmPassword');
        submitButton = await page.waitForXPath("//button[contains(., 'Change password')]");
      });

      it('Validates current password', async () => {
        await currentPassInput.type(wrongCurrentPass);
        await newPassInput.type(newPass);
        await confirmPassInput.type(newPass);
        await submitButton.click();

        const error = await (await page.waitForSelector('div.currentPassword span.validation-error')).evaluate((el) => el.textContent);

        expect(error).toEqual('Invalid password');
      });

      it('Makes sure user does not repeat the previous password', async () => {
        await _c(currentPassInput);
        await _c(newPassInput);
        await _c(confirmPassInput);

        await currentPassInput.type(accountPass);
        await newPassInput.type(accountPass);
        await confirmPassInput.type(accountPass);
        await submitButton.click();

        const error = await (await page.waitForSelector('div.newPassword span.validation-error')).evaluate((el) => el.textContent);

        expect(error).toEqual('Current and new passwords are the same');
      });

      it('Makes sure that new and confirmation passwords match', async () => {
        await _c(currentPassInput);
        await _c(newPassInput);
        await _c(confirmPassInput);

        await currentPassInput.type(accountPass);
        await newPassInput.type(newPass);
        await confirmPassInput.type(newPassNotMatch);
        await submitButton.click();

        const error = await (await page.waitForSelector('div.confirmPassword span.validation-error')).evaluate((el) => el.textContent);

        expect(error).toEqual('Passwords do not match');
      });
    });
  });
});
