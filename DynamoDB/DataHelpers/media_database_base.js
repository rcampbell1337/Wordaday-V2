const IDynamoDB = require("../IDynamoDB");

module.exports = class MediaDatabaseBase extends IDynamoDB {

    constructor() {
        super(process.env.album_access, process.env.album_secret);
        this.type;
    }

    async write(data) {
        var key = this.type === "album" ? "album_name" : "film_name";

        var input = {
            "discord_user": data["discord_user"], 
             key: data[key]
        };

        var params = {
            TableName: this.table_name,
            Item: input
        };

        this.docClient.put(params, function (err, data) {

            // Gives feedback
            if (err) {
                console.log(`cache::save::error - ` + JSON.stringify(err, null, 2));                      
            } else {
                console.log(`cache::save::success` );                      
            }
        });
    }

    async remove(user) {

        // Defines what is to be deleted
        var params = {
            TableName: this.table_name,
            Key: {
                "discord_user": user
            }
        };

        // Excecute the delete method
        this.docClient.delete(params, function (err, data) {

            if (err) {
                console.log("cache::delete::error - " + JSON.stringify(err, null, 2));
            } else {
                console.log("cache::delete::success");
            }
        });
    }
}