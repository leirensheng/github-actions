let startBrowser = require("./startBrowser");
const { sleep,getTime } = require("./utils");

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
      await page.waitForSelector("input[type=password]")
      
      await page.evaluate(() => {
        document.querySelector("input[type=password]").value = "07505461203";
        document.querySelector("#save").click();
      });
      console.log("点击了登录");
      await page.waitForNavigation();
    }
    await page.waitForFunction(()=>{
        let dom = document.querySelector("#statusWanIP")
        return dom && dom.innerText
    })
    let curIp = await page.$eval("#statusWanIP", (dom) => dom.innerText);
    console.log(getTime()+ "当前的IP: " + curIp);

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
  console.log("点击了系统菜单",getTime(),getTime());

  let noLoop = false
  page.on("dialog", async (dialog) => {
    console.log(dialog.message());
    await dialog.accept();
    console.log("点击弹窗确定了",getTime());
    noLoop = true
  });
  await sleep(1000)

  while(!noLoop){
    await myClick("#reboot");
    await sleep(1000)
  }
  
  console.log("点击了重启, 等待30s",getTime());

  await sleep(30000)

  await waitForWebsite();
};
startBrowser(start);
