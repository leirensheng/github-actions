let fs = require("fs");
let axios  = require('axios')
let content = fs.readFileSync("./responseData", "utf-8");
let body = {
  token: "ff7273be19b84a01b99f47cedbfb8694",
  title: "BANK",
  content: content,
  template: "html",
  channel: "wechat",
};
axios.post("https://www.pushplus.plus/api/send", body);
