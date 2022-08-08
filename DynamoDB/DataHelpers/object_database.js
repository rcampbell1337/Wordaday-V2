const IDynamoDB = require("../IDynamoDB");

module.exports = class ObjectDatabase extends IDynamoDB {

    constructor() {
        super(process.env.album_access, process.env.album_secret);
        this.table_name = "cache_objects";
    }

    async write(data) {
        // Passes in a peice of data
        var input = {
            "object_id": data["object_id"], "object": data["object"]
        };

        var params = {
            TableName: this.table_name,
            Item:  input
        };
        this.docClient.put(params, function (err, data) {

            // Gives feedback
            if (err) {
                console.log("cache-objects::save::error - " + JSON.stringify(err, null, 2));                      
            } else {
                console.log("cache-objects::save::success" );                      
            }
        });
    }

    async remove(id) {
        // Defines what is to be deleted
        var params = {
            TableName: this.table_name,
            Key: {
                "object_id": id
            }
        };

        // Execute the delete method
        this.docClient.delete(params, function (err, data) {

            if (err) {
                console.log("cache-objects::delete::error - " + JSON.stringify(err, null, 2));
            } else {
                console.log("cache-objects::delete::success");
            }
        });
    }
}