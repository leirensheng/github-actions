let startBrowser = require("./startBrowser");
const { sleep } = require("./utils");

let start = async (page) => {
  let waitForWebsite = async (times = 999) => {
    let isSuccess;
    let useTimes = 0;
    while (!isSuccess && useTimes <= times) {
      try {
        await page.goto("http://leirensheng.dynv6.net:2048/index.html", {
          timeout: 5000,
        });
        isSuccess = true;
      } catch (e) {
        console.log(useTimes + "网站登录不了, 重试");
      }
      useTimes++;
    }
  };

  let loginAndGetIp = async () => {
    await sleep(1000);
    let needLogin = await page.evaluate(() => location.href.includes("login"));
    if (needLogin) {
      console.log("需要登录");
      await sleep(1000);
      await page.evaluate(() => {
        document.querySelector("input[type=password]").value = "07505461203";
        document.querySelector("#save").click();
      });
      console.log("点击了登录");
      await page.waitForNavigation();
    }
    let curIp = await page.$eval("#statusWanIP", (dom) => dom.innerText);
    console.log("当前的IP: " + curIp);

    return curIp;
  };
  let myClick = async (selector) => {
    await page.waitForSelector(selector);
    await page.evaluate((selector) => {
      document.querySelector(selector).click();
    }, selector);
  };
  await page.goto("http://leirensheng.dynv6.net:2048/index.html");
  let preIp = await loginAndGetIp();

  await myClick("#system");
  console.log("点击了系统菜单");

  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.accept();
    console.log("点击弹窗确定了");
    // await browser.close();
  });

  await myClick("#reboot");
  console.log("点击了重启, 等待2分钟");
  await sleep(2 * 60000);

  await waitForWebsite();

  let ip = await loginAndGetIp();
  if (ip !== preIp) {
    console.log("成功了！！！");
  }
};
startBrowser(start);
