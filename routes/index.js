var express = require('express');
var router = express.Router();
const puppeteer = require("puppeteer");
// const cors = require("cors")

/* GET home page. */
// router.get('/', function(req, res, next) {
//   res.render('index', { title: 'Express' });
// });
//

// var corsOptions = {
//   origin: 'http://localhost:3000',
//   optionsSuccessStatus: 200 // some legacy browsers (IE11, various SmartTVs) choke on 204
// };


router.post('/post-snap-xml/:projectName',
    async function (req, res, next) {
  const {projectName} = req.params;
  const {projectJson, hasNonScripts, hasScripts} = req.body;
  console.log("req.body");
  console.log("projectJson: ", projectJson);
  console.log("hasNonScripts: ", hasNonScripts);
  console.log("hasScripts: ", hasScripts);
  const downloadXML = async () => {
    const browser = await puppeteer.launch({
      devtools: false,
      args: [
        '--disable-web-security',
        '--disable-features=IsolateOrigins',
        '--disable-site-isolation-trials'
      ]
    });
    // const browser = await puppeteer.launch();
    const page = await browser.newPage();
    await page.goto('http://localhost/snapinator/dist/index.html', {
      waitUntil: 'networkidle2',
    });
    console.timeEnd("launch")
    await page.waitForSelector('#urlInput');
    await page.focus('#urlInput')
    await page.type('#urlInput', projectName);
    await page.click('#urlInputButton');
    console.timeEnd("type");

    await page.waitForSelector('#downloadXML');
    console.log('finished finding download xml');
    const xmlUrl = await page.$eval('#downloadXML', ele => ele.innerHTML);
    // console.log("xmlUrl: ", xmlUrl);
    await browser.close();
    return xmlUrl
  };
  console.time("translate");
  console.time("type");
  console.time("launch");
  const xml = await downloadXML();
  // res.send(new Blob([xml], {type: 'text/xml'}));
  res.send(xml)
  console.timeEnd("translate");
});

module.exports = router;
