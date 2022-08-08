// This file deletes from the database
// Include the amazon software development kit
require('dotenv').config();
var AWS = require("aws-sdk");

module.exports = class IDynamoDB {
    constructor(accessKey, secretAccessKey) {
        // Credentials
        this.awsConfig = {
            "region": "us-east-2",
            "endpoint": "http://dynamodb.us-east-2.amazonaws.com",
            "accessKeyId": accessKey, "secretAccessKey": secretAccessKey
        };
        AWS.config.update(this.awsConfig);

        this.table_name = "";

        this.docClient = new AWS.DynamoDB.DocumentClient();
    }

    async index() {
        const params = {
            TableName: this.table_name,
        };
    
        let scanResults = [];
        let items;
        do{
            items =  await this.docClient.scan(params).promise();
            items.Items.forEach((item) => scanResults.push(item));
            params.ExclusiveStartKey  = items.LastEvaluatedKey;
        }while(typeof items.LastEvaluatedKey != "undefined");
    
        return scanResults;
    }

    async write() {
        throw new console.error("This method has not been implemented.");
    }

    async remove() {
        throw new console.error("This method has not been implemented.");
    }
    
}