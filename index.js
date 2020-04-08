const cron = require("node-cron");
const stats = require("./fetchData");
// const saveToS3 = require("./save") // presumes JSON
const fs = require('fs')
const sync = require('./syncData')
const debounce = require('debounce-async').default // prevents several writes to S3 whenever any file under tmp/ changes. Holds up for ten seconds. If a change event is fired within those ten seconds the sync call from the last change event is cancelled.
const globals = require('./globals');
const createJHUGlobalTree = require('./createJHUGlobalTree')

;(async() => {

    const last7Days = await createJHUGlobalTree.create(7)
    const last28Days = await createJHUGlobalTree.create(30)
    const allDataToDate = await createJHUGlobalTree.create()

    fs.writeFileSync(`${__dirname}/dev/jhu-data-7-days.json`, JSON.stringify(last7Days));
    fs.writeFileSync(`${__dirname}/dev/jhu-data-28-days.json`, JSON.stringify(last28Days));
    fs.writeFileSync(`${__dirname}/dev/jhu-data-to-date.json`, JSON.stringify(allDataToDate));

})()

// const dSync = debounce(sync.gatherAllRegions, 10000)

// fs.watch('./tmp', event => {
//   console.info(event)
//   if(event === 'change') {
//     dSync()
//     .then(data => { saveToS3(data) })
//     .catch(err => {
//       if(err.toString() === 'canceled') {
//         console.error(new Error('Debounced').toString())
//       } else {
//         console.error(err)
//       }
//     })
//   } else { return undefined }
// })

// cron.schedule("*/10 * * * *", () => {
//   console.log("Scraper scheduled.");
//   try {
//     console.log("Fetching data.");
//     stats.fetchAllData();
//   } catch(error) {
//     console.error(error)
//   }
// });
