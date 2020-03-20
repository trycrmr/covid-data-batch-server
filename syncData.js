const globals = require("./globals");
const fs = require("fs");
const utilities = require("./utilities");

exports.gatherAllRegions = () => {
  return Promise.all(
    globals.allRegions.map(region =>
      fs.promises.readFile(utilities.getJSONPath(region.sheetName))
    )
  ).then(values => {
    let data = {};

    values.forEach(region => {
      const regionData = JSON.parse(region);
      const regionName = regionData.regionName;

      console.log(regionData.regions.length);
      console.log(regionData.regionName);

      data[regionName] = regionData;

      //console.log(data[regionName].regionTotal);


      data[regionName].recoveryRate =
        Math.ceil((parseInt(
          data[regionName].regionTotal.recovered.replace(",", "")
        ) /
          parseInt(
            data[regionName].regionTotal.cases.replace(",", "")
          )) *
        100);
    });

    return {
      ...data,
      allRegions: Object.keys(data)
    };
  });
};
