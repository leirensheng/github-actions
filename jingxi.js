let startBrowser = require("./startBrowser");
const { sleep, autoScroll,getQrCode } = require("./utils");

let keyword = "垃圾袋";
// let keyword = "纸巾";

let mustHasName = "垃圾袋";
let endPrice = 4;
let limitPrice = 2.5

let start = async (page, isLocal, browser) => {
  page.on("console", (msg) => console.log("PAGE LOG:", msg.text()));
  // page.goto('https://st.jingxi.com/pingou/account/index.html')
  // await page.waitForSelector('')

  page.goto(`https://st.jingxi.com/index.shtml`);
  let input = await page.waitForSelector("#topSearchTxt");
  input.click();
  await sleep(1000);
  await page.evaluate((keyword) => {
    $("#topSearchTxt").value = keyword;
    $("#topSearchbtn").click();
  },keyword);

  await page.waitForSelector(".more-filter");
  await page.$eval(".more-filter", (dom) => dom.click());
  await page.waitForSelector("[data-name=包邮]");
  await page.evaluate(async(endPrice) => {
    $("[data-name=包邮]").click();
    $("[placeholder=最高价]").value = endPrice;
    $("[placeholder=最高价]").dispatchEvent(new Event("input"));
  
    await sleep(1000)
    $(".panel-btn.confirm").click();
  },endPrice);

  await sleep(1000);

  await autoScroll(page);

  let items = await page.evaluate((mustHasName,endPrice) => {
    let items = $$("[id^=goods-item]");
    console.log(items.length);
    let strReverse = (str) => str.split("").reverse().join("");
    return items
      .map((one) => {
        let name = one.querySelector(".goods-item-title").innerText.trim();
        console.log(name);
        let price = one.querySelector(".goods-item-area-price .int").innerText;
        let regRex = strReverse(name).match(/(只|个)(\d+)/);
        let number = regRex ? strReverse(regRex[2]) : 1;
        let id = one.id.split('-').pop()
        let coverTips = one.querySelector('.cover-tips')?.innerText
        return {
          name,
          price,
          number,
          adv: (price / number) * 100,
          id,
          coverTips
        };
      })
      .filter((one) => {
        let nameNotMatchReg = /(薄款)|(不推荐)|(15\*24)|(15*26)|(薄建议买)|(较薄)|(很薄)/g;
        let isNameOk =
          !nameNotMatchReg.test(one.name) && one.name.includes(mustHasName);
          let advOk = one.adv<10
          let priceOk = one.price<=endPrice
          let tipsOk = !(one.coverTips&&one.coverTips.includes('起售'))
        return isNameOk && advOk && priceOk && tipsOk
      });
  },mustHasName,endPrice);

  items.sort((a, b) => a.adv - b.adv)
  
 items=  items.filter(one=> one.price<= limitPrice)
  
  items.forEach(one=>{
    console.log(one)
    getQrCode(`https://m.jingxi.com/item/view?sku=${one.id}`)
  })

  await sleep(1000000);
};
startBrowser(start);
