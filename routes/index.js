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

// const pageOpen = false;
let browser;
let page;

(async ( ) => {
  browser = await puppeteer.launch({
    devtools: true,
    args: [
      '--disable-web-security',
      '--disable-features=IsolateOrigins',
      '--disable-site-isolation-trials'
    ]
  });
// const browser = await puppeteer.launch();
  page = await browser.newPage();
  await page.goto('http://localhost/snapinator/dist/index.html', {
    waitUntil: 'networkidle2',
  });
  console.log("page launched")
})();


router.post('/post-snap-xml/:projectName',
    async function (req, res, next) {
  const {projectName} = req.params;
  const {projectJson, type} = req.body;
  console.log("req.body");
  console.log("projectJson: ", projectJson);
  console.log("type: ", type);
  const downloadXML = async (projectName, projectJson, type) => {
    try {
      console.log(projectName, projectJson, type);
      await page.waitForSelector('#refreshOutputLog');
      await page.click('#refreshOutputLog');

      await page.waitForSelector('#urlInput');
      const inputData = `${type}[DELIM]${projectName}`
      await page.$eval("#urlInput", (ele, ipt) =>
          ele.value = ipt, inputData);
      // await page.focus('#urlInput')
      // await page.type('#urlInput', `${type}[DELIM]${projectName}`);

      //any element in the document that contains `id' is defined in the code as a variable that indicates its element by default
      await page.waitForSelector('#projectJsonInput');
      // console.log("projectJson: ", projectJson);
      await page.$eval("#projectJsonInput", (ele, j) =>
          ele.value = j, projectJson);

      await page.click('#urlInputButton');

      console.timeEnd("type");
      await page.waitForSelector('#downloadXML');
      console.log('finished finding download xml');
      const xmlUrl = await page.$eval('#downloadXML', ele => ele.innerHTML);
      return xmlUrl
    }
    catch(error) {
      console.error(error);
    }
    // return ""
  };
  console.time("translate");
  console.time("type");
  console.time("launch");
  const xml = await downloadXML(projectName, projectJson, type);
  res.send(xml)
  console.timeEnd("translate");
});

module.exports = router;
