const express = require("express");
const mongoPool = require("../configFiles/MongoConnectionPooling");
const app = express.Router();

const tweets = require("../model/tweets");

app.post("/addNewTweet", async (req, res) => {
  console.log("In AddNewtweet POST");

  var x = req.body.tweetMsg;
  var separators = [" ", "\\+", "-", "\\(", "\\)", "\\*", "/", ":", "\\?"];
  var tokens = x.split(new RegExp(separators.join("|"), "g"));
  console.log("tokens", tokens);

  var arr = [];
  for (var index = 0; index < tokens.length; index++) {
    if (tokens[index].indexOf("#") == 0) {
      console.log("hash", tokens[index]);
      arr.push(tokens[index]);
    }
  }

  console.log("------", arr);
  var d = new Date().toString();
  var l = d.split(' ').splice(0, 4).join(' ');  
  var hours = new Date().getHours();
  var minutes = new Date().getMinutes();
  var seconds = new Date().getSeconds();

  l = l+" "+hours+" "+minutes+" "+seconds;
  var new_tweet = new tweets({
    userName: req.body.userName,
    firstName: req.body.firstName,
    lastName: req.body.lastName,
    profileImage: req.body.userImage,
    tweetMsg: req.body.tweetMsg,
    tweetDate: l,
    tweetMedia: req.body.tweetMedia,
    isRetweet: false,
    parentId: req.body.parentId,
  });


  new_tweet.save(async (err, result) => {
    if (err) {
      console.log("Unable to tweet", err);
      res.status(411).end("Unable to tweet");
    } else {
      console.log("Tweet success");
      return await tweets
        .update(
          { _id: result._id },
          { $push: { hashtags: { $each: arr } } },
          { upsert: true }
        )
        .then(result2 => {
          console.log("added to hastag", result2);
          res.end(JSON.stringify("tweet successfully saved"));
        })
        .catch(err => {
          console.log(err);
          res.end("could not save tweet");
        })
    }
  });
});

module.exports = app;