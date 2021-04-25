const functions = require('./core_methods');
const remove = require("../ObjectDatabase/delete");
const { v4: uuidv4 } = require('uuid');
const save = require("../ObjectDatabase/write");

// This class takes in people and generates a random one
module.exports = class Randomobject
{
    // Constuctor passes in the discord message param
    constructor(msg, object_list)
    {
        this.msg = msg;
        this.object_list = object_list;
    }

    // Insert a object into the temporary list
    insertObject(args)
    {
        if (!args[1]) return this.msg.reply("Error, please enter define an object title");
        else
        {
            let object = "";
            for (let arg in args)
            {
                if (arg > 0)
                {
                    object += args[arg] + " ";
                }
            }
            let uuid = uuidv4();
            save.save(uuid, object);
            this.object_list.push({
                "object_id": uuid,
                "object": object
            });
            this.msg.channel.send(object + "added!");
        }
    }

    // Gets a random object from the list
    selectObject()
    {
        if (this.object_list.length > 0)
        {
            let object_index = functions.getRandomInt(this.object_list.length);
            let value = this.object_list[object_index];
            this.msg.channel.send(value.object);
            console.log(this.object_list.length);
            this.object_list.splice(object_index, 1);
            remove.remove(value.object_id);
        }
        else
        {
            this.msg.channel.send("There are no objects in the list, you silly goose");
        }
    }
}
