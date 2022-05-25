let puppeteer = require("puppeteer-core");
const path = require('path')
let start = require(path.resolve(__dirname,"./main.js"))
let init = async () => {
  browser = await puppeteer.launch({
    args: ["--no-sandbox"],
    executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
    headless: false,
  });
  const page = await browser.newPage(); //打开一个空白页

  await start(page);
  await browser.close();
}


init()