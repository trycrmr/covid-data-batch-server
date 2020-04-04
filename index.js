const cron = require("node-cron");
const stats = require("./fetchData");
const saveToS3 = require("./save") // presumes JSON
const fs = require('fs')
const sync = require('./syncData')
const debounce = require('debounce-async').default // prevents several writes to S3 whenever any file under tmp/ changes. Holds up for ten seconds. If a change event is fired within those ten seconds the sync call from the last change event is cancelled.

// const dSync = debounce(sync.gatherAllRegions, 10000)

// for the first sheet
  // get every day and the numbers for every location denoted. Region == 'region + all subregions' for now as a location key, but keep all the location data in the object (Ex. "Country_Region", "Province_State", etc.)
  // create weekly aggregates for every concatenated location
  // create monthly aggregates for every concatenated location
  // create current aggregates for every concatenated location
  // use concatenated locations to determine the current location mappings in JHU data
  // Use the continent to country mappings to create the first iteration of nested location, then insert nested locations where necessary
// start at the beginning until all sheets are done
( async() => {
  try {
    const allData = []
    /* allData schema
    [
      {
        name: 'region name' // top-level is going to be the seven continents
        subregions: []
        totals: {
          current: { cases: #, deaths: #, start: date, end: date },
          monthly: [{ cases: #, deaths: #, start: date, end: date }, ...] // each element is a full month since 1/22
          weekly: [{ cases: #, deaths: #, start: date, end: date }, ...] // each element is a full week since 1/22
          daily: [{ cases: #, deaths: #, start: date, end: date }, ...] // each element is each day since 1/22
        }
      }
    ]
    */
    let jhuData = await stats.fetchJHUData()
    let firstSheet = jhuData[0]

    const blah = firstSheet.data.reduce((acc, curr, currIdx, origArr) => {
      let continent = 'North America'
      let tmpLocation = `${curr.Country_Region} -- ${curr.Province_State}`
      if(!acc.tmpLocation) {
        acc[continent][tmpLocation] = { current: { cases: curr["4/2/20"] } }
      } else {
        acc.tmpLocation.current.cases = acc.tmpLocation.current.cases + curr["4/2/20"]
      }
      return acc
    }, { "North America": {} })
    
    console.info(JSON.stringify(blah, null, 2))
    // console.info(JSON.stringify(jhuData, null, 2))
  } catch(err) {
    console.error(err)
  } 
})() // >> into dev/whatever.json in terminal for dev

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
