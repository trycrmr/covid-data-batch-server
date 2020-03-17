const globals = require("./globals");
const utilities = require("./utilities");
const bnoScraper = require("./micro-scrapers/bno");
const cnnScraper = require("./micro-scrapers/cnn");
const coronatrackerScraper = require("./micro-scrapers/coronatracker");
const fs = require("fs");

exports.fetchAllData = async () => {
  const allData = {};
  const bnoRegions = globals.allRegions
    .filter(region => {
      return region.scraper === "bno";
    })
    .map(region => bnoScraper.fetchData(region));

    // TODO: Refactor. Some wacky promise behavior here.
    Promise.all(bnoRegions)
    .then(data => {

      // Gather BNO data as base.
      data.map(
        resolvedRegion => (allData[resolvedRegion.regionName] = resolvedRegion)
      );

      allData["LatinAmerica"].regions,
        allData["Global"].regions = utilities.syncTwoRegions(
          allData["LatinAmerica"].regions,
          allData["Global"].regions
        );

    })
    .then(() => {

      // Sync coronatracker data and BNO data.
      coronatrackerScraper
        .getSelectedCountries("Europe", globals.countryLists["Europe"])
        .then(europeanData => {

          allData["Europe"] = europeanData;

          allData["Europe"].regions,
            allData["Global"].regions = utilities.syncTwoRegions(
              allData["Europe"].regions,
              allData["Global"].regions
            );
        })
        .then(() => {

          // Sync USA data and CNN data.
          cnnScraper.fetchData().then(cnnData => {
            cnnData,
              (allData["USA"].regions = utilities.syncTwoRegions(
                cnnData,
                allData["USA"].regions
              ));

            allData["USA"].regionTotal = utilities.calculateRegionTotal(
              allData["USA"].regions
            );

            // Sync with Overrides and write final finals.
            gatherAllOverrides(allData);
          });
        });
    });
};

const gatherAllOverrides = (allData) => {
  return Promise.all(
    Object.keys(allData).map(region =>
      fs.promises.readFile(`${utilities.getOverridesJSONPath(region)}`))
  ).then(values => {
    let data = {};

    values.forEach(region => {
      const regionData = JSON.parse(region);
      data[regionData.regionName] = regionData;
    });

    Object.keys(data).map(region => {
      data[region].regions,
        (allData[region].regions = utilities.syncTwoRegions(
          data[region].regions,
          allData[region].regions
        ));

        allData[region].regionTotal = utilities.calculateRegionTotal(
          data[region].regions
        );
    })

    // Sync the Global United States value with the Region value.
    // Region will be the correct one because it is has two sources.
    allData["Global"].regions.map((region, index) => {
      if(region.country === "United States") {
        allData["Global"].regions[index].cases = allData["USA"].regionTotal.cases,
        allData["Global"].regions[index].deaths = allData["USA"].regionTotal.deaths,
        allData["Global"].regions[index].serious = allData["USA"].regionTotal.serious,
        allData["Global"].regions[index].recovered = allData["USA"].regionTotal.recovered
      }
    })

    Object.keys(data).map(region => {
      utilities.writeJSONFile(region, allData[region]);
    })
  });
};
