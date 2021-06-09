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

const checkUrl = function(urlToBeChecked){
  return new Promise((resolve, reject) => {
    let ip = lookup(urlToBeChecked);
    ip.then((res)=>{
      let req = unirest("GET", api_url);
        req.headers({
          "accept": "application/json",
          "key": "ee769908e8567d24965cdeba485e2e164106ade8016176eda6492741ce745f21b0e51b6c939f11ab"
        });
        req.query({"ipAddress": res.address});
        req.end((res, err) => {
          if (err) {
            reject(err)
          }
          else{
            resolve(Math.floor(res.body.data.abuseConfidenceScore/25))
          }
        });
    }).catch(()=>{reject(false)})
  })
}
module.exports = {
  checkUrl: checkUrl
};
