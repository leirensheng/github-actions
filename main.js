let fs = require("fs");
let sleep = (time) => new Promise((r) => setTimeout(r, time));

let start = async (page) => {
  await page.goto("https://zhuanlan.zhihu.com/p/519500356", {
    waitUntil: "networkidle2", // 网络空闲说明已加载完毕
  });
  await sleep(3000);

  let res = await page.$eval(".Post-RichTextContainer", (el) => el.innerText);
  fs.writeFileSync("./responseData", res);
};

module.exports = start;
