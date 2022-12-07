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

  let firstRowName = await page.$eval(
    "table tbody tr:nth-child(2) td:nth-child(8)",
    (dom) => dom.innerText
  );
  console.log("第一个发行时间: " + firstRowName);

  let date = getDate();
  let year = date.getFullYear();
  let month = date.getMonth() + 1;
  let day = date.getDate();
  let handleNumber = (val) => (val > 9 ? val : "0" + val);
  let cur = `${year}-${handleNumber(month)}-${handleNumber(day)}`;
  console.log("当前时间:" + cur);
  if (firstRowName === cur) {
    sendMsg("今天有可转债: " + cur);
  }
};
startBrowser(start);
