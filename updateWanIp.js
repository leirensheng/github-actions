let startBrowser = require("./startBrowser");
const { sleep } = require("./utils");

let start = async (page) => {
  await page.goto("http://leirensheng.dynv6.net:2048/index.html");
  let needLogin = await page.evaluate(() => location.href.includes("login"));
  if (needLogin) {
    console.log("需要登录");
    await sleep(1000)
    await page.evaluate(() => {
      document.querySelector("input[type=password]").value = "07505461203";
      document.querySelector("#save").click();
    });
    console.log("点击了登录")
    await page.waitForNavigation();
  }
  await sleep(1000)
  await page.click("#system");
  console.log("点击了系统菜单")


  await page.waitForSelector("#reboot");

  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.accept();
    console.log("点击弹窗确定了")
    // await browser.close();
  });
  await sleep(1000)
  await page.evaluate(() => {
    document.querySelector("#reboot").click();
  });
  console.log("点击了重启")
  await sleep(1000)
};
startBrowser(start);
