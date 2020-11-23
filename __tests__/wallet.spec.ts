import puppeteer from 'puppeteer';

describe('Todo React', () => {
  let browser: puppeteer.Browser;
  let page: puppeteer.Page;
  let extensionPage: string;

  beforeAll(async () => {
    console.log(__dirname);
    const pathToExtension = require('path').join(__dirname, '../packages/extension/build');

    console.log(pathToExtension);
    browser = await puppeteer.launch({ headless: false,
      args: [
        `--disable-extensions-except=${pathToExtension}`,
        `--load-extension=${pathToExtension}`
      ] });

    const targets = await browser.targets();
    const backgroundPageTarget = targets.find((target) => target.type() === 'background_page');
    // @ts-ignore
    const [,, extensionID] = backgroundPageTarget._targetInfo.url.split('/');

    extensionPage = `chrome-extension://${extensionID}/index.html`;
    console.log('>>>> extensionPage', extensionPage);
  });

  afterEach(async () => {
    await page.close();
  });

  afterAll(async () => {
    // await browser.close();
  });

  describe('add task to the list', () => {
    beforeEach(async () => {
      page = await browser.newPage();
      await page.goto(extensionPage);
    });

    it('should be possible to add task to the list', async () => {
    //   const taskInputField = await page.$x('//input[@placeholder="Enter task"]');
    //   const taskToAdd = 'New Task';

      //   await taskInputField[0].click();
      //   await taskInputField[0].type(taskToAdd);

      //   await page.keyboard.press('Enter');

      //   const lists = await page.$x("//div[@class='list']/p/input");

      //   let toDo;

      //   for (const list of lists) {
      //     toDo = await page.evaluate((el) => el.getAttribute('value'), list);
      //   }

    //   expect(toDo).toBe(taskToAdd);
    });
  });
});
