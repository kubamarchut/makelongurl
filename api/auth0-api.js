const unirest = require("unirest");
const dns = require('dns');

const api_url = "https://signals.api.auth0.com/v2.0/ip/";

function lookup(domain) {
  return new Promise((resolve, reject) => {
    dns.lookup(domain, (err, address, family) => {
      if (err) {
        reject(err)
      } else {
        resolve({ address, family })
      }
    })
  })
}

const checkUrl = function(urlToBeChecked){
  return new Promise( async (resolve, reject) => {
    let ip = await lookup(urlToBeChecked);
    let req = unirest("GET", api_url + ip.address);
      req.headers({
        "accept": "application/json",
        "x-auth-token": "dab988b5-d32d-4fbb-9576-c326d1bb92ef"
      });
      req.end((res, err) => {
        if (err) {
          reject(err)
        }
        else{
          resolve(res.body.fullip.score)
        }
      });
  })
}
module.exports = {
  checkUrl: checkUrl
};
