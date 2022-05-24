(async ()=>{
    browser = await puppeteer.launch({
        args: ['--no-sandbox'],
        executablePath: process.env.PUPPETEER_EXEC_PATH, // set by docker container
        headless: false,
        
      });
      const page = await browser.newPage(); //打开一个空白页
      await page.goto('https://tieba.baidu.com/index.html', {
        waitUntil: 'networkidle2' // 网络空闲说明已加载完毕
      }); //打开百度贴吧
      await sleep(3000);
      
})()
