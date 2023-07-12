const mongoose = require('mongoose');

const dbUrl = "mongodb://127.0.0.1:27017/makelongurl-db"

mongoose.connect(dbUrl, {
  useNewUrlParser: true,
  useCreateIndex: true,
  useUnifiedTopology: true,
  useFindAndModify: false
}, (err) => {
  if (err) console.log("Could not".red, "connected to" ,"DB".magenta);
  else console.log("Successfully".green, "connected to" ,"DB".magenta);
});

const UrlRecipe = mongoose.model('UrlRecipe', {
  destUrl: {
    type: String
  },
  urlCode: {
    type: String
  },
  safetyRating: {
    type: Object
  }
})
const findInDb = async function(object) {
  try{
    return await UrlRecipe.find(object);
    console.log("Found".green, "data in", "DB".magenta)
  }
  catch(err){
    console.error(err);
  }
}

const saveToDb = async function(destUrl, urlCode, safetyRating){
  let newUrl = new UrlRecipe({
    destUrl: destUrl,
    urlCode: urlCode,
    safetyRating: safetyRating
  })
  try{
    return await newUrl.save()
  }
  catch(error){
    console.error(error);
  }
}
const updateData = async function(filter, data){
  try{
    return await UrlRecipe.findOneAndUpdate(filter, data);
    console.log("Modified".yellow, "data in", "DB".magenta)
  }
  catch(err){
    console.error(err);
  }
}


module.exports = {
  urlrec: UrlRecipe,
  findInDb: findInDb,
  saveToDb: saveToDb,
  updateData: updateData
};
