const axios = require("axios");
let covid = require('novelcovid');
const utilities = require("../utilities");


const URL = "https://corona.lmao.ninja/states";
const keyMapping = {
  country: "country",
  cases: 'cases',
  deaths: 'deaths',
  recovered: 'recovered',
  todayCases: 'todayCases',
  todayDeaths: 'todayDeaths'
};
const stateKeyMapping = {
  country: "state",
  cases: 'cases',
  deaths: 'deaths',
  recovered: 'recovered',
  todayCases: 'todayCases',
  todayDeaths: 'todayDeaths'
}

exports.fetchData = async () => {
  let allCountries = await covid.countries();

  return axios({
    method: "get",
    url: URL,
    responseType: "text"
  }).then(response => {
    let allStates = response.data;

    allCountries = allCountries.map(country => utilities.convertAllKeysToString(utilities.remapKeys(country, keyMapping, true)))

    console.log(allCountries[0]);


    allStates = allStates.map(state => utilities.convertAllKeysToString(utilities.remapKeys(state, stateKeyMapping)))

    console.log(allStates[0]);
    data = allCountries.concat(allStates);

    console.log(data[0]);

    return utilities.renameCountryLabels(data)
  });
}
