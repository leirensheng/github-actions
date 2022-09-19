const { WxPusher, Message } = require("wxpusher");
let msg = process.argv[2];


let sendMsg = async () => {
  const message = new Message();
  message.content = msg;
  message.uids = ["UID_ZFqEpe7kmm27SJ466yXdnbeWyIgL"];
  const result = await new WxPusher("AT_s8ql37DbRNkrItpYhUK60xNNTeNE3ekp").send(
    message
  );
  console.log(result);
};


sendMsg()