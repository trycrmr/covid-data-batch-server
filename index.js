const cron = require("node-cron");
const express = require("express");
const fs = require("fs");
const path = require("path");
const stats = require("./fetchData");
const sync = require("./syncData");
const time = require("./getTime");
const globals = require("./globals");
const graphData = require("./tmp/statistics_graph.json");

// Fetch data every minute.
// cron.schedule("* * * * *", () => {
//   try {
//     stats.fetchAllData();
//   } catch(error) {
//     console.error(error)
//   }
// });

const getContent = (res, view) => {
  sync.gatherAllRegions().then(data => {
    res.render(view, {
      data: {
        ...data,
        lastUpdated: 'a few seconds ago',
        displayOrder: globals.displayOrder
    }
    });
  }).catch(error => {
    console.error(error)
  })
};

const app = express();
app.use(express.static(path.join(__dirname, "public")));
app.set("view engine", "ejs");

app.get("/", (req, res) => getContent(res, "data"));
app.get("/about", (req, res) => getContent(res, "about"));
app.get("/data", (req, res) => getContent(res, "data"));
app.get("/faq", (req, res) => getContent(res, "faq"));
app.get("/map", (req, res) => getContent(res, "map"));
app.get("/preparation", (req, res) => getContent(res, "prepping"));
app.get("/prevention", (req, res) => getContent(res, "prevention"));
app.get("/tweets", (req, res) => getContent(res, "tweets"));
app.get("/wiki", (req, res) => getContent(res, "coronainfo"));
app.get("/travel", (req, res) => getContent(res, "travel"));
app.get("/press", (req, res) => getContent(res, "press"));
app.get("/email", (req, res) => getContent(res, "email"));



app.get("/graphs", (req, res) => getContent(res, "graphs"));

app.listen(process.env.PORT || 3000);
console.log("Listening on port: " + 3000);
