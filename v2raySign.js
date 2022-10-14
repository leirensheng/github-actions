let startBrowser = require("./startBrowser");
const { sleep } = require("./utils");

let start = async (page, isLocal) => {
  let myClick = async (selector) => {
    try {
      await page.waitForSelector(selector, { timeout: 2000 });
      await page.evaluate((selector) => {
        document.querySelector(selector).click();
      }, selector);
    } catch (e) {}
  };

  let startOne = async (email) => {
    console.log("当前用户:", email);
    let url = isLocal ? "https://go.runba.cyou/user" : "https://v2free.org";
    page.goto(url);
    await page.waitForSelector("input[type=email]");
    let needLogin = await page.evaluate(() => location.href.includes("login"));
    if (needLogin) {
      console.log("需要登录");
      await sleep(1000);
      await page.evaluate((email) => {
        document.querySelector("input[type=email]").value = email;
        document.querySelector("input[type=password]").value = "hik12345+";
        document.querySelector("button[type=submit]").click();
      }, email);
      console.log("点击了登录");
      await page.waitForNavigation();
    }
    await myClick(".modal-dialog #result_ok");

    let timer = setInterval(() => {
      myClick(".modal-dialog #result_ok");
    }, 2000);

    let hasRemain = await page.evaluate(
      () => document.querySelector("#remain").innerText
    );
    console.log("当前剩余流量:" + hasRemain);

    let checkBtn = await page.evaluate(() => {
      let checkBtn = document.querySelector("#checkin");
      if (checkBtn) {
        checkBtn.click();
      }
      return checkBtn;
    });

    if (checkBtn) {
      console.log("点击成功");
      await page.evaluate(() => {
        location.reload();
      });
      await page.waitForNavigation();
      await myClick(".modal-dialog #result_ok");

      let curRemain = await page.evaluate(
        () => document.querySelector("#remain").innerText
      );

      if (hasRemain !== curRemain) {
        console.log("当前剩余流量:" + curRemain);
      }
    } else {
      let hasSigned = await page.evaluate(() =>
        document.body.innerText.includes("今日已签到")
      );
      if (hasSigned) {
        console.log("已经签了,不需要签");
      } else {
        console.log("找不到签到");
      }
    }
    await sleep(1000);

    await myClick('a[href="/user/logout"]');
    await sleep(2000);

    clearInterval(timer);
  };

  let emails = [
    "leirensheng@163.com",
    "hik@163.com",
    "hik1@163.com",
    "hik2@163.com",
  ];
  for (let one of emails) {
    await startOne(one);
  }
};
startBrowser(start);
