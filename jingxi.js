let startBrowser = require("./startBrowser");
const { sleep, autoScroll } = require("./utils");

let keyword = "惠寻 口罩 无菌 医用";
// let keyword = "纸巾";

let mustHasName = "口罩";
let startPrice = 10;
let endPrice = 18;
let isJdZiying = false;
let isJdExpress = false;
let isNoExpressFee = false;

let start = async (page, isLocal, browser) => {
  // page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  page.goto(
    `https://st.jingxi.com/index.shtml`
  );
  let input = await page.waitForSelector('#topSearchTxt')
  input.click()
  await sleep(1000)
  await page.evaluate(()=>{
    $('#topSearchTxt').value = "垃圾袋"
    $('#topSearchbtn').click()
  })
  await page.waitForSelector('.more-filter')
  

  await sleep(1000000);
};
startBrowser(start);
