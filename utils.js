// const request = require("request");
const fs = require("fs");
const path = require("path");

const qrcode = require("qrcode-terminal");

function padLeftZero(str) {
  return ("00" + str).substr(str.length);
}
function getRandom(min, max) {
  return Math.floor(Math.random() * (max - min) + min);
}
let sleep = (time, max) => {
  let realTime = time;
  if (max) {
    realTime = getRandom(time, max);
  }
  return new Promise((resolve) => setTimeout(resolve, realTime));
};

let getQrCode = (url) => qrcode.generate(url, { small: true });

let formatNumber = (val) => (val < 10 ? "0" + val : val);

let getChinaDate = () => {
  var timezone = 8;
  var offset_GMT = new Date().getTimezoneOffset();
  var nowDate = new Date().getTime();
  var targetDate = new Date(
    nowDate + offset_GMT * 60 * 1000 + timezone * 60 * 60 * 1000
  );
  return targetDate;
};
let getTime = (date) => {
  if (!date) {
    date = getChinaDate();
  }
  let hour = date.getHours();
  let minute = date.getMinutes();
  let second = date.getSeconds();
  let millisecond = date.getMilliseconds();

  return `${formatNumber(hour)}:${formatNumber(minute)}:${formatNumber(
    second
  )}.${millisecond}`;
};
module.exports = {
  getRandom,
  getTime,
  sleep,
  //   async sendMsg(title, content) {
  //     let url =
  //       "https://sc.ftqq.com/SCU140452T9252cb72421645e17678387c06a491eb5fe9fa509e160.send?text=" +
  //       encodeURIComponent(title) +
  //       "&desp=" +
  //       encodeURIComponent(content);
  //     await request(url);
  //   },

  async saveCookies(page, user) {
    const cookiesObject = await page.cookies();
    fs.writeFileSync(
      path.resolve(__dirname, user + "Cookies.json"),
      JSON.stringify(cookiesObject, null, 4)
    );
  },

  async recoverCookies(page, user) {
    let cookiesFilePath = path.resolve(__dirname, user + "Cookies.json");

    const previousSession = fs.existsSync(cookiesFilePath);
    if (previousSession) {
      const cookiesArr = require(`${cookiesFilePath}`);
      if (cookiesArr.length !== 0) {
        for (let cookie of cookiesArr) {
          await page.setCookie(cookie);
        }
        console.log("Session has been loaded in the browser");
        return true;
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

  appendCode: (page) => {
    let code = `;$$ =(val)=> [...document.querySelectorAll(val)];$=(val)=>document.querySelector(val);`;
    page.evaluateOnNewDocument(code);
    page.exposeFunction("getQrCode", getQrCode);
    page.exposeFunction("sleep", sleep);
  },

  getQrCode,
  autoScroll: async (page) => {
    return page.evaluate(() => {
      return new Promise((resolve, reject) => {
        let totalHeight = 0;
        let distance = 100;
        let timer = setInterval(() => {
          let scrollHeight = document.body.scrollHeight;
          window.scrollBy(0, distance);
          totalHeight += distance;
          if (totalHeight >= scrollHeight) {
            clearInterval(timer);
            resolve();
          }
        }, 100);
      });
    });
  },

  sendMsg: async (msg) => {
    const { WxPusher, Message } = require("wxpusher");

    const message = new Message();
    message.content = msg;
    message.uids = ["UID_ZFqEpe7kmm27SJ466yXdnbeWyIgL"];
    const result = await new WxPusher(
      "AT_s8ql37DbRNkrItpYhUK60xNNTeNE3ekp"
    ).send(message);
    console.log(result);
  },

  async myClick(page, selector, timeout = 6000) {
    await page.waitForSelector(selector, { timeout });
    await page.$eval(selector, (dom) => dom.click());
  },
};
