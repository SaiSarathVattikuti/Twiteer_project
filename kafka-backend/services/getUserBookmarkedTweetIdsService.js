const express = require("express");
const mongoPool = require("../configFiles/MongoConnectionPooling");
const app = express.Router();
var mysqlPool = require("../configFiles/MysqlConnectionPooling");
var mysql = require("mysql");

const { tweets } = require("../model/tweets");
const { lists } = require("../model/lists");
const { Musers } = require("../model/Musers");


async function handle_request(msg, callback) {

    console.log("Inside getUserBookmarkedTweetIds in kafka backend");
    let response = {};
    let err = {};

    return await Musers
        .findOne({ userName: msg.userName })
        .select("bookmarked")
        .then(async result => {
            var bookmarked_array = [];
            // console.log(result);
            result.bookmarked.forEach(element => {
                bookmarked_array.push(element.tweetId);
            });
            console.log('bookmarked array', bookmarked_array);
            //res.status(200).end(JSON.stringify(bookmarked_array));
            response.status = 200;
            response.data = JSON.stringify(bookmarked_array);
            return callback(null, response);
        })
        .catch(error => {
            console.log("could not get following", error);
            //return res.status(411).end("could not get following");
            err.status = 410;
            err.message = "could not get following";
            err.data = error;
            return callback(err, null);
        });
};

exports.handle_request = handle_request;