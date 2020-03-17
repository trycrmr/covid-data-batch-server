const axios = require("axios");
const csv = require("csvtojson");
const globals = require("../globals");
const time = require("../getTime");
const utilities = require("../utilities");
const fs = require("fs");

exports.fetchData = region => {
  return axios({
    method: "get",
    url: utilities.getExternalCSV(region.sheetName),
    responseType: "stream"
  }).then(response => {
    response.data.pipe(
      fs.createWriteStream(utilities.getCSVPath(region.sheetName))
    );
    return csv()
      .fromFile(utilities.getCSVPath(region.sheetName))
      .then(json => {
        return generatedRegionalData(
          json,
          region.startKey,
          region.totalKey,
          region.sheetName
        );
      });
  });
};

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

const trimWhitespaceOnKeys = data => {
  Object.keys(data).map(parentKey => {
    if (["regionTotal"].includes(parentKey)) {
      if (!data[parentKey]) return;
      Object.keys(data[parentKey]).map(key => {
        const oldKey = `${key}`;
        const newKey = key.trim();

        Object.defineProperty(
          data[parentKey],
          newKey,
          Object.getOwnPropertyDescriptor(data[parentKey], oldKey)
        );
        delete data[parentKey][oldKey];
      });
    } else {
      data[parentKey].map(obj => {
        Object.keys(obj).map(key => {
          const oldKey = `${key}`;
          const newKey = key.trim();

          Object.defineProperty(
            obj,
            newKey,
            Object.getOwnPropertyDescriptor(obj, oldKey)
          );
          delete obj[oldKey];
        });
      });
    }
  });

  return data;
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
  trimWhitespaceOnKeys(sortedData);
  sortedData.regions = utilities.renameCountryLabels(sortedData.regions)
  sortedData.regionName = sheetName;
  sortedData.lastUpdated = time.setUpdatedTime();

  if (sheetName === "LatinAmerica" && !!sortedData.regions) {
    sortedData = extractCountryFromRegion("España", "LatinAmerica", sortedData);
  }

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
    )
  };
  data.regions.splice(targetCountryIndex, 1);

  return data;
};
