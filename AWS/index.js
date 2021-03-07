// This file gets all data database
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

// Export the async get all albums function
module.exports = async () => {
    const params = {
        TableName: "cache_albums",
    };

    let scanResults = [];
    let items;
    do{
        items =  await docClient.scan(params).promise();
        items.Items.forEach((item) => scanResults.push(item));
        params.ExclusiveStartKey  = items.LastEvaluatedKey;
    }while(typeof items.LastEvaluatedKey != "undefined");

    return scanResults;
};