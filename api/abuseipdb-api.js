const unirest = require("unirest");
const dns = require('dns');

const api_url = "https://api.abuseipdb.com/api/v2/check/";

function lookup(domain) {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, address, family) => {
      if (err) {
        reject(err)
      } else {
        resolve({address, family})
      }
    })
  })
}
console.log("Api key", process.env.ABUSEIPDB_APIKEY);
const checkUrl = function(urlToBeChecked){
  return new Promise((resolve, reject) => {
    let ip = lookup(urlToBeChecked);
    ip.then((res)=>{
      let req = unirest("GET", api_url);
        req.headers({
          "accept": "application/json",
          "key": process.env.ABUSEIPDB_APIKEY
        });
        req.query({"ipAddress": res.address});
        req.end((res, err) => {
          if (err) {
            reject(err)
          }
          else{
            console.log(res.body.data)
            resolve(Math.floor(res.body.data.abuseConfidenceScore/25))
          }
        });
    }).catch((err)=>{
      console.log(err);
      reject(false)
    })
  })
}
module.exports = {
  checkUrl: checkUrl
};
