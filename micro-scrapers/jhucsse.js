const axios = require("axios");
const csv = require("csvtojson");
const JHUCSSE_URLS = require("../globals").JHUCSSE_URLS;

exports.fetchData = (urls = JHUCSSE_URLS) => {
  return Promise.all(
    urls
    .map(thisUrl => {
      try {
        console.debug(`Requesting JHUCSSE ${thisUrl.name}`)
        return axios({
          method: "get",
          url: thisUrl.url,
          responseType: "text"
        })
        .then(response => { 
          return csv().fromString(response.data).then(data => { return { name: thisUrl.name, data } })
        })
        .catch(err => {err.message = `(JHUCSSE issue) ${err.message}`; return err})
      } catch(err) {
        return err
      }
    })
  )
}