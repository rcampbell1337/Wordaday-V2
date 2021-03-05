// This file inserts into the database
// Include the amazon software development kit
require('dotenv').config();
var AWS = require("aws-sdk");

// Credentials
let awsConfig = {
    "region": "us-east-2",
    "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
    "accessKeyId": process.env.album_access, "secretAccessKey": process.env.album_secret
};
AWS.config.update(awsConfig);

// Determine the client type
let docClient = new AWS.DynamoDB.DocumentClient();

// The save method
const save = function (name, album) {

    // Passes in 2 pieces of data
    var input = {
        "discord_user": name, "album_name": album
    };
    var params = {
        TableName: "cache_albums",
        Item:  input
    };
    docClient.put(params, function (err, data) {

        // Gives feedback
        if (err) {
            console.log("cache-albums::save::error - " + JSON.stringify(err, null, 2));                      
        } else {
            console.log("cache-albums::save::success" );                      
        }
    });
}

// Export for the main class
exports.save = save;