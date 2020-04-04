const cron = require("node-cron");
const stats = require("./fetchData");
// const saveToS3 = require("./save") // presumes JSON
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
    console.debug(firstSheet.data[0])

    // Refactor current location array map thing to just reverse the "Combined_Key" value in the JHU object

    const blah = firstSheet.data
    .map(thisRow => { return { ...thisRow, continent: 'North America' }})
    .map(thisRow => { return { ...thisRow, location: new Array(1).fill(thisRow.continent) }})
    .map(thisRow => {thisRow.location = [...thisRow.location, thisRow.Country_Region]; return thisRow})
    .map(thisRow => {thisRow.location = [...thisRow.location, thisRow.Province_State]; return thisRow})
    .reduce((acc, curr, currIdx, origArr) => {
      let superRegions = new Array(1).fill(acc) // last superRegion is the current region being used as the parent
      let i = 0
      while(curr.location.length > i) {
        // console.info('i',i)
        // console.info(superRegions[i])
        // console.info('curr.location[i]', curr.location[i])
        if(!superRegions[i][curr.location[i]]) { // if the subregion doesn't exist, create it. Or update totals of current region, push found subregion to superregions array, and bump search index
          superRegions[i][curr.location[i]] = {
            name: curr.location[i],
            subregions: [],
            totals: { current: +(curr["4/2/20"]) }
          }
          superRegions.push(superRegions[i][curr.location[i]])
        } else {
          // console.info('superRegions[i]', superRegions[i])
          superRegions[i].totals.current += +(curr["4/2/20"])
          superRegions.push(superRegions[i][curr.location[i]])
        }
        i++
      }
      // console.debug(curr.location)
      // if(!acc[curr.location[0]]) { // if the continent doesn't exist, create it
      //   acc[curr.location[0]] = {
      //     name: curr.location[0],
      //     subregions: [],
      //     totals: { current: 0 }
      //   }
      // } else {
  
      // }

      // let tmpLocation = `${curr.Country_Region} -- ${curr.Province_State}`
      // if(!acc.tmpLocation) {
      //   acc[continent][tmpLocation] = { current: { cases: curr["4/2/20"] } }
      // } else {
      //   acc.tmpLocation.current.cases = acc.tmpLocation.current.cases + curr["4/2/20"]
      // }
      return acc
    }, {
      name: "Earth",
      subregions: [],
      totals: { current: 0 }
    })
    
    // console.info(JSON.stringify(blah, null, 2))
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
