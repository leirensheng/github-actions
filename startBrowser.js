let puppeteer = require("puppeteer-core");
const { appendCode, sleep } = require("./utils");
let isLocal = process.argv[2];
let options;

let init = async (start) => {
  if (isLocal) {
    const findChrome = require("./node_modules/carlo/lib/find_chrome");
    let findChromePath = await findChrome({});
    let executablePath = findChromePath.executablePath;
    options = {
      executablePath,
      args: ["--no-sandbox", "--disable-setuid-sandbox"],
      ignoreDefaultArgs: ["--enable-automation"],
      headless: false,
    };
  } else {
    options = {
      args: ["--no-sandbox"],
      executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
      headless: false,
    };
  }
  browser = await puppeteer.launch(options);
  const page = await browser.newPage(); //打开一个空白页
  appendCode(page)
  await sleep(100)
  await start(page, isLocal, browser);
  await browser.close();
};

module.exports = init;
