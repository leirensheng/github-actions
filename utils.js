// const request = require("request");
const fs = require("fs");
const path = require("path");

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
function getRandom(min,max) {
  return Math.floor(Math.random()*(max-min)+min)
}
module.exports = {
  getRandom,
   sleep(time,max){
    let realTime = time
    if(max){
      realTime = getRandom(time,max)
    }
    return new Promise(resolve=>setTimeout(resolve, realTime))
  },
//   async sendMsg(title, content) {
//     let url =
//       "https://sc.ftqq.com/SCU140452T9252cb72421645e17678387c06a491eb5fe9fa509e160.send?text=" +
//       encodeURIComponent(title) +
//       "&desp=" +
//       encodeURIComponent(content);
//     await request(url);
//   },

  async saveCookies(page,user) {
    const cookiesObject = await page.cookies();
    fs.writeFileSync(path.resolve(__dirname,user+"Cookies.json"), JSON.stringify(cookiesObject,null,4));
  },

  async recoverCookies(page,user){
    let cookiesFilePath =path.resolve(__dirname, user+"Cookies.json")

    const previousSession = fs.existsSync(cookiesFilePath)
    if (previousSession) {
      const cookiesArr = require(`${cookiesFilePath}`)
      if (cookiesArr.length !== 0) {
        for (let cookie of cookiesArr) {
          await page.setCookie(cookie)
        }
        console.log('Session has been loaded in the browser')
        return true
      }
    }
  },

  getNameLength(name) {
    let length = 0;
    for (let i = 0; i < name.length; i++) {
      const isChinese = /[\u4e00-\u9fa5]|（|）|；|，|。|【|】/.test(name[i]);
      length += isChinese ? 2 : 1;
    }
    return length;
  },
  formatDate(date, fmt = "yyyy-MM-dd hh:mm:ss") {
    if (typeof date !== "object") {
      date = new Date(Number(date));
    }
    if (/(y+)/.test(fmt)) {
      fmt = fmt.replace(
        RegExp.$1,
        (date.getFullYear() + "").substr(4 - RegExp.$1.length)
      );
    }
    const o = {
      "M+": date.getMonth() + 1,
      "d+": date.getDate(),
      "h+": date.getHours(),
      "m+": date.getMinutes(),
      "s+": date.getSeconds(),
    };
    for (const k in o) {
      if (new RegExp(`(${k})`).test(fmt)) {
        const str = o[k] + "";
        fmt = fmt.replace(
          RegExp.$1,
          RegExp.$1.length === 1 ? str : padLeftZero(str)
        );
      }
    }
    return fmt;
  },
};
