let startBrowser = require("./startBrowser");
const { sleep, sendMsg } = require("./utils");

let start = async (page, isLocal) => {
  let getDate = () => {
    var timezone = 8;
    var offset_GMT = new Date().getTimezoneOffset();
    var nowDate = new Date().getTime();
    var targetDate = new Date(
      nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
    );
    return targetDate;
  };
  await Promise.all([
    page.goto("https://www.hfzq.com.cn/kzz.aspx"),
    page.waitForNavigation(),
  ]);

  let date = getDate();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let handleNumber = (val) => (val > 9 ? val : "0" + val);
  let cur = `${year}-${handleNumber(month)}-${handleNumber(day)}`;
  console.log("当前时间:" + cur);

  let res = await page.evaluate((cur) => {
    let rows = [
      ...document.querySelectorAll("table tbody tr:not(:first-child)"),
    ];

    let target = rows.find((one) => {
      let date = one.querySelector("td:nth-child(8)").innerText;
      return date === cur;
    });
    if (target) {
      return {
        name: target.querySelector("td:nth-child(4)"),
      };
    }
    return null;
  }, cur);


  if (res) {
    let msg = `今天【${cur}】有可转债: `  + res.name
    console.log(msg)
    sendMsg(msg);
  }
};
startBrowser(start);
