const axios = require("axios");
const csv = require("csvtojson");
const globals = require("../globals");
const time = require("../getTime");
const utilities = require("../utilities");
const fs = require("fs");

const keyMapping = {
  country: "country ",
  cases: "cases ",
  deaths: "deaths ",
  recovered: "recovered ",
  serious: "serious ",
  critical: "critical ",
};

exports.fetchData = region => {
  return axios({
    method: "get",
    url: utilities.getExternalCSV(region.sheetName),
    responseType: "text"
  }).then(response => {
<<<<<<< HEAD
    return csv().fromString(response.data).then(json => {
      return generatedRegionalData(
        json,
        region.startKey,
        region.totalKey,
        region.sheetName
      )
    }).catch(error=> {
      console.error(error);
    });
=======
    response.data.pipe(
      fs.createWriteStream(utilities.getCSVPath(region.sheetName))
    );
    return csv()
      .fromFile(utilities.getCSVPath(region.sheetName))
      .then(json => {

        if(json.length === 1) {
          return fs.promises.readFile(utilities.getJSONPath(region.sheetName)).then((data)=> {
            return JSON.parse(data)
          })
        }

        return generatedRegionalData(
          json,
          region.startKey,
          region.totalKey,
          region.sheetName
        );
      });
>>>>>>> First pass at getting daily case counts
  });
}

const removeEmptyRows = data => {
  return data.filter(row => !!row["country "]);
};

const gatherCategoryIndexes = (order, data) => {
  return order.map(key =>
    data.findIndex(element => {
      return element["country "] === key;
    })
  );
};

const gatherBetweenRows = (startKey, endKey, data) => {
  return data.slice(startKey + 1, endKey);
};

const generatedRegionalData = (data, startKey, totalKey, sheetName) => {
  const sanitiziedData = removeEmptyRows(data);
  const rowOrder = [startKey, totalKey];
  const rowIndexes = gatherCategoryIndexes(rowOrder, sanitiziedData);
  let sortedData = {
    regions: gatherBetweenRows(rowIndexes[0], rowIndexes[1], sanitiziedData),
    regionTotal: sanitiziedData.find(element => {
      return element["country "] === totalKey;
    })
  };

<<<<<<< HEAD
  trimWhitespaceOnKeys(sortedData);
  sortedData.regions = utilities.renameCountryLabels(sortedData.regions);
  sortedData.regionName = sheetName;
  sortedData.lastUpdated = time.setUpdatedTime();

  sortedData.regions.map(region => {
    region.serious = region.serious === "N/A" ? "0" : region.serious;
  });

=======
  if(sheetName === "Global") {
    //console.log(sortedData, sheetName);
  }



  sortedData.regions = sortedData.regions.map(region => {
    return utilities.remapKeys(region, keyMapping)
  })
  sortedData.regions = utilities.renameCountryLabels(sortedData.regions)
  sortedData.regionName = sheetName;
  sortedData.lastUpdated = time.setUpdatedTime();

  if (sheetName === "LatinAmerica" && !!sortedData.regions) {
    sortedData = extractCountryFromRegion("España", "LatinAmerica", sortedData);
  }

  if(!sortedData.regionTotal) {
    return fs.promises.readFile(utilities.getJSONPath(region.sheetName)).then((data)=> {
      return JSON.parse(data)
    })
  }
  console.log('before ', sheetName, sortedData.regionTotal);

  sortedData.regionTotal = utilities.remapKeys(sortedData.regionTotal, keyMapping)

  console.log('after ', sortedData.regionTotal);
>>>>>>> First pass at getting daily case counts
  return sortedData;
};

const extractCountryFromRegion = (country, region, data) => {
  const targetCountryIndex = data.regions
    .map(region => {
      return region.country;
    })
    .indexOf(country);

  const targetCountry = data.regions[targetCountryIndex];
  data.regionTotal = {
    ...data.regionTotal,
    cases: utilities.subtractTwoValues(
      data.regionTotal.cases,
      targetCountry.cases
    ),
    deaths: utilities.subtractTwoValues(
      data.regionTotal.deaths,
      targetCountry.deaths
    ),
    serious: utilities.subtractTwoValues(
      data.regionTotal.serious,
      targetCountry.serious
    ),
    critical: utilities.subtractTwoValues(
      data.regionTotal.critical,
      targetCountry.critical
    ),
    recovered: utilities.subtractTwoValues(
      data.regionTotal.recovered,
      targetCountry.recovered
    ),
    todayCases: '',
    todayDeaths: ''
  };
  data.regions.splice(targetCountryIndex, 1);

  return data;
};
