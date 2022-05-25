const fs = require("fs");
const path =require('path')
// console.log(fs.readFileSync(path.resolve(__dirname, "./config.json") ,'utf-8'))
// const config = require('./config.json')
// let {runInLinux,user} = config
const puppeteer = require('puppeteer-core');
const findChrome = require("./node_modules/carlo/lib/find_chrome");
const start = require("./main.js");
const log = require('./log')

// const {recoverCookies,sendMsg, saveCookies} = require('./utils')
// const iPhone = puppeteer.devices['iPhone 8'];

async function init() {
  let browser
  let findChromePath = await findChrome({});
  let executablePath = findChromePath.executablePath;
   browser = await puppeteer.launch({
    executablePath,
    args: ['--no-sandbox', '--disable-setuid-sandbox'],
    ignoreDefaultArgs: ["--enable-automation"],
    headless: false,
    // userDataDir: "./tempData/data", //可以重用数据，cookie 和缓存
    // args: ['--start-fullscreen'], //全屏打开页面
    // slowMo:10
  });
  const page = await browser.newPage();
  // await recoverCookies(page,user)
  await page.evaluateOnNewDocument(() => {
    const newProto = navigator.__proto__;
    delete newProto.webdriver;
    navigator.__proto__ = newProto;
  });

  try {
    await start(page);
  } catch (e) {
    log.red(`❌${e.message}❌`);
    // sendMsg('❌惊喜工厂❌',e.message)
    console.log(e);
  }
}
init();
