const cron = require("node-cron");
const stats = require("./fetchData");


console.log("Scraper scheduled.");

//Fetch data every minute.
cron.schedule("*/2 * * * *", () => {
  try {
    console.log("Fetching data.");
    stats.fetchAllData();
  } catch(error) {
    console.error(error)
  }
});
