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
    `https://search.jd.com/search?keyword=${encodeURIComponent(keyword)}`
  );
  await page.waitForSelector("[data-field=shop]");

  await sleep(1000);

  await page.evaluate(
    (startPrice, endPrice) => {
      let parent = document.querySelector("#J_selectorPrice");
      let start = parent.querySelectorAll("input")[0];
      start.value = startPrice;

      let end = parent.querySelectorAll("input")[1];
      end.value = endPrice;
      parent.querySelector("[data-url]").click();
    },
    startPrice,
    endPrice
  );

  await sleep(2000);

  // 京东物流
  let JdExpress = await page.waitForSelector("[data-field=shop]");
  if (isJdExpress) {
    await JdExpress.click();
  }

  await sleep(1000);

  await autoScroll(page);

  let items = await page.evaluate(
    (isNoExpressFee, isJdZiying, mustHasName) => {
      let items = $$("li[data-sku]");
      let freeItems = items.filter((one) => {
        let name = one
          .querySelector(".p-name em")
          .innerText.replace(/\(|\)/g, "")
          .trim();
        console.log(name);

        let nameNotMatchReg =
          /(中国风)|(\d\-(\d){1,2}岁|(中国红)|(N95)|(10只$)|(10支$)|(10个$)|(10片$)|(10只\/包))/g;
        let isNameOk =
          !nameNotMatchReg.test(name) && name.includes(mustHasName);

        return (
          isNameOk &&
          (isNoExpressFee
            ? one.querySelector("[data-tips=当前收货地址，本商品免邮费]")
            : true) &&
          (isJdZiying
            ? one.querySelector("[data-tips=京东自营，品质保障]")
            : true)
        );
      });

      return freeItems.map((one) => {
        let name = one
          .querySelector(".p-name em")
          .innerText.replace(/\(|\)/g, "")
          .trim();
        let price = one.querySelector(".p-price i").innerText;
        let lastName = name.split(/\s/).pop();

        let match = /(\d+)/g.exec(lastName);
        let number = match ? match[1] : 1;
        return {
          name,
          lastName,
          price,
          number,
          adv: (price / number) * 100,
          sku: one.dataset.sku,
          comment: one.querySelector('.p-commit strong').innerText,
          isZiying: !!one.querySelector("[data-tips=京东自营，品质保障]"),
          isFree: !!one.querySelector("[data-tips=当前收货地址，本商品免邮费]"),
        };
      });
    },

    isNoExpressFee,
    isJdZiying,
    mustHasName
  );
  items.sort((a, b) => a.adv - b.adv);

  console.log("res", items);
  await sleep(1000000);

  // console.log(freeItems[0].querySelector)
  // freeItems.forEach(one=>{
  //   let name = document.querySelector()
  // })
  return;
  let skus = freeItems.map((one) => one.dataset.sku);
  skus.forEach(async (sku) => {
    let page = await browser.newPage();
    page.goto(`https://item.jd.com/${sku}.html`, { timeout: 8866888 });
  });

  await sleep(1000000);
};
startBrowser(start);
