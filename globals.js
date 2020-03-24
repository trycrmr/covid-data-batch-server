exports.allRegions = [
  {
    name: "Africa",
    sheetName: "Africa",
    scraper: "coronatracker"
  },
  {
    name: "World",
    sheetName: "Global",
    startKey: "WORLD",
    totalKey: "TOTAL",
    scraper: "bno"
  },
  {
    name: "USA",
    sheetName: "USA",
    startKey: "UNITED STATES",
    totalKey: "U.S. TOTAL",
    scraper: "bno"
  },
  {
    name: "China",
    sheetName: "China",
    startKey: "MAINLAND CHINA",
    totalKey: "TOTAL",
    scraper: "bno"
  },
  {
    name: "Canada",
    sheetName: "Canada",
    startKey: "CANADA",
    totalKey: "TOTAL",
    scraper: "bno"
  },
  {
    name: "Australia",
    sheetName: "Australia",
    startKey: "AUSTRALIA",
    totalKey: "TOTAL",
    scraper: "bno"
  },
  {
    name: "Latin America",
    sheetName: "LatinAmerica",
    startKey: "Mundo Hispano",
    totalKey: "TOTAL",
    scraper: "bno"
  },
  {
    name: "Europe",
    sheetName: "Europe",
    scraper: "coronatracker"
  }
];

exports.displayOrder = [
  "Global",
  "USA",
  "Europe",
  "China",
  "Canada",
  "Australia",
  "Africa",
  "LatinAmerica"
];

exports.countryLists = {
  Europe: [
    "Albania",
    "Austria",
    "Belarus",
    "Belgium",
    "Bosnia and Herzegovina",
    "Bulgaria",
    "Czechia",
    "Croatia",
    "Cyprus",
    "Czech Republic",
    "Denmark",
    "Estonia",
    "Finland",
    "France",
    "Germany",
    "Greece",
    "Hungary",
    "Ireland",
    "Italy",
    "Latvia",
    "Lithuania",
    "Luxembourg",
    "Malta",
    "Netherlands",
    "Norway",
    "Poland",
    "Portugal",
    "Romania",
    "San Marino",
    "Serbia",
    "Slovakia",
    "Slovenia",
    "Spain",
    "Sweden",
    "Switzerland",
    "United Kingdom"
  ],
  Africa: [
    "Algeria",
    "Angola",
    "Benin",
    "Botswana",
    "Burkina Faso",
    "Burundi",
    "Cabo Verde",
    "Cameroon",
    "Central African Republic (CAR)",
    "Chad",
    "Comoros",
    "Congo, Democratic Republic of the",
    "Congo, Republic of the",
    "Cote d'Ivoire",
    "Djibouti",
    "Egypt",
    "Equatorial Guinea",
    "Eritrea",
    "Eswatini (formerly Swaziland)",
    "Ethiopia",
    "Gabon",
    "Gambia",
    "Ghana",
    "Guinea",
    "Guinea-Bissau",
    "Kenya",
    "Lesotho",
    "Liberia",
    "Libya",
    "Madagascar",
    "Malawi",
    "Mali",
    "Mauritania",
    "Mauritius",
    "Morocco",
    "Mozambique",
    "Namibia",
    "Niger",
    "Nigeria",
    "Rwanda",
    "Sao Tome and Principe",
    "Senegal",
    "Seychelles",
    "Sierra Leone",
    "Somalia",
    "South Africa",
    "South Sudan",
    "Sudan",
    "Tanzania",
    "Togo",
    "Tunisia",
    "Uganda",
    "Zambia",
    "Zimbabwe"
  ]
};

exports.AlternativeLabelNames = {
  "Bosnia and Herzegovina": "Bosnia",
  Brasil: "Brazil",
  Czechia: "Czech Republic",
  México: "Mexico",
  Panamá: "Panama",
  "Rep. Dominicana": "Dominican Republic"
};

exports.regionStructure = {
  regionName: "",
  regions: [],
  regionTotal: {
    country: "TOTAL",
    cases: "",
    deaths: "",
    recovered: "",
    serious: "",
    critical: "",
    todayCases: "",
    todayDeaths: ""
  }
};

exports.countryStructure = {
  country: "TOTAL",
  cases: "",
  deaths: "",
  recovered: "",
  serious: "",
  critical: "",
  todayCases: "",
  todayDeaths: ""
};

exports.CSV_URL =
  "https://docs.google.com/spreadsheets/d/14dnT6yUxZiHWvPaEiWsOKu1xPQ_xwkuuUDfMGmFHinc/gviz/tq?tqx=out:csv&sheet=";
