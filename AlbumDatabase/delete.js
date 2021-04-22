// This file deletes from the database
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

// The delete method
const remove = function (user) {

    // Defines what is to be deleted
    var params = {
        TableName: "cache_albums",
        Key: {
            "discord_user": user
        }
    };

    // Excecute the delete method
    docClient.delete(params, function (err, data) {

        if (err) {
            console.log("cache-albums::delete::error - " + JSON.stringify(err, null, 2));
        } else {
            console.log("cache-albums::delete::success");
        }
    });
}

// Export the delete function
exports.remove = remove;