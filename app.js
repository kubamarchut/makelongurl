function generateString(desiredLength){
  let result           = '';
  let characters       = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789';
  let charactersLength = characters.length;
  for ( let i = 0; i < desiredLength; i++ ) {
    result += characters.charAt(Math.floor(Math.random() * charactersLength));
  }
  return result;
}
function getDate(){
  var date = new Date();
  return date.toUTCString();
}
const express = require('express');
const favicon = require('serve-favicon')
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const colors = require('colors');
const handlingDb = require('./db/handling-db.js');
const auth0Api = require('./api/auth0-api.js');

const listofsubpage = ["termsofusage", "abouttheproject", "contact"]

const app = express();
const PORT = process.env.PORT || 80;


var server = app.listen(PORT, console.log('WebServer'.magenta, 'started'.green, 'on port', String(PORT).cyan));

app.set('view engine', 'ejs');
app.use(favicon(path.join(__dirname, 'assets', 'favicon.ico')))
app.use('/assets', express.static('assets'));
app.use(bodyparser.json());

app.get('/', function(req, res) {
  res.render('index');
});
app.get('/favicon.ico', function(req, res) {
  res.sendFile(path.join(__dirname + "/assets/favicon.ico"));
});
app.get('/:urlCode', async function(req, res) {
  let param = req.params.urlCode;
  if(param[0] != '#' && param.length > 0 && listofsubpage.indexOf(param) == -1){
    console.log("Requesting".yellow, "redirection with code", String(param).cyan)
    let foundWithSameCode = await handlingDb.findInDb({urlCode: param});
    if(foundWithSameCode.length > 0){
      let safetyRatingDate = foundWithSameCode[0].safetyRating.ratingDate;
      let timeDiff = Math.round((Date.now() - safetyRatingDate) / 3600000);
      let destUrl = foundWithSameCode[0].destUrl;
      if(timeDiff < 24){
        let rating = foundWithSameCode[0].safetyRating.rating;
        if(rating == 0){
          res.redirect("https://" + destUrl);
        }
        else{
          let ratingdes = ['safe', 'potentially harmful', 'not safe', 'dangerous']
          res.render("redirect", {url: destUrl, rating: ratingdes[rating * -1].replace(' ', '-'), ratingDes: ratingdes[rating * -1]});
        }
        console.log("Found".green, String(param + " -> " + destUrl).cyan, "with", "current".green, "security rating")
      }
      else{
        console.log("Found".green, String(param + " -> " + destUrl).cyan, "with", "old".red, "security rating")
        console.log("Updating safety rating for".yellow, destUrl.cyan)
        let safetyRating = {
          rating: await auth0Api.checkUrl(destUrl),
          ratingDate: Date.now()
        };
        let modifiedRecord = await handlingDb.updateData(
          {urlCode: param},
          {safetyRating: safetyRating}
        );
        let rating = safetyRating.rating;
        if(rating == 0){
          res.redirect("https://" + destUrl);
        }
        else{
          let ratingdes = ['safe', 'potentially harmful', 'not safe', 'dangerous']
          res.render("redirect", {url: destUrl, rating: ratingdes[rating * -1].replace(' ', '-'), ratingDes: ratingdes[rating * -1]});
        }
      }
    }
    else{
      res.render("url-not-found");
    }
  }
  else if(listofsubpage.indexOf(param) != -1){
    res.render(param);
  }
});

app.post('/createNewUrl', async function(req, res){
  let data = req.body;
  let foundWithSameDestUrl = await handlingDb.findInDb({destUrl: data.destUrl});
  let saveNewQuery = true;
  console.log("Searching for duplicates");
  if(foundWithSameDestUrl.length > 0){
    for (var i = 0; i < foundWithSameDestUrl.length; i++) {
      if(foundWithSameDestUrl[i].urlCode.length == data.urlLength){
        console.log("Found duplicate");
        res.send({'error': false, 'msg': foundWithSameDestUrl[i].urlCode})
        saveNewQuery = false;
        break;
      }
    }
  }
  if(saveNewQuery){
    console.log("Creating".yellow, "new long url for", String(data.destUrl).cyan, "with length", String(data.urlLength).cyan)
    console.log("Generating new url code");
    let urlCode = generateString(data.urlLength);
    let foundWithSameCode = handlingDb.findInDb({urlCode: urlCode});
    while(foundWithSameCode.length == 0){
      let urlCode = generateString(data.urlLength);
    }
    console.log("Acquiring safety rating");
    let isItReal = auth0Api.checkUrl(data.destUrl);
    isItReal.then((rate)=>{
      let safetyRating = {
        rating: rate,
        ratingDate: Date.now()
      }
      console.log("Saving recipe to DB")
      let doneSaving = handlingDb.saveToDb(data.destUrl, urlCode, safetyRating)
      doneSaving.then(()=>{
        res.send({'error': false, 'msg': urlCode})
        console.log("Successfully".green, "saved new recipe on", "DB".magenta)
      }).catch(()=>{
        res.send({'error': true, 'msg': "Something went wrong while saving new url to db"})
        console.log("Something went wrong while saving new url to db")
      })
    }).catch(()=>{
      res.send({'error': true, 'msg': "I couldn't find your website 🕵, make sure you didn't misspell it and try again 🤞"})
      console.log("Something went wrong while getting safety rating new url to db")
    })
  }
});
