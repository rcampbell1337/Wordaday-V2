const functions = require('./core_methods');

// This class contains all of the album selectiong methods
module.exports = class Album 
{

    // Pass in the discord message parameter
    constructor(msg, album_list)
    {
        this.msg = msg;
        this.album_list = album_list;
    }

    // Adds an album to the list
    addAlbum(args)
    {

        // See if the user has submitted an album
        let add_album = async() => 
        {
            try
            {
                if (this.msg.member.user.username in album_list)
                {
                    return true;
                }
                else
                {
                    return false;
                }
            } 
            catch(e)
            {
                console.log(e)
            }
        } 

        // Append the users name and album choice to the object
        if (add_album)
        {
            if (!args[1]) return this.msg.reply("Error, please enter define an album title");
            else 
            {
                let album_name = "";
                for (let arg in args)
                {
                    if (arg > 0)
                    {
                        album_name += args[arg] + " ";
                    }
                }
                this.msg.channel.bulkDelete(1);
                this.album_list[this.msg.member.user.username] = album_name;
                console.log(Object.keys(this.album_list));
            }
        }
        else 
        {
            return this.msg.reply("You have already chosen an album.");
        }

        // Tell the user how many albums are in the object
        if (Object.keys(this.album_list).length == 1)
            this.msg.channel.send("There is now " + Object.keys(this.album_list).length + " album in the list!");
        else
            this.msg.channel.send("There are now " + Object.keys(this.album_list).length + " albums in the list!");
    }

    // Shows me who has submitted an album in the console
    adminGetNames()
    {
        this.msg.channel.bulkDelete(1);
        console.log(Object.keys(this.album_list));
    }

    // Generates an album from the list already defined, then remove it
    generateAlbum()
    {

        // Get a random album, delete it and send it to users
        let length_list = Object.keys(this.album_list).length;
        if (length_list > 0)
        {
            let rand_album = functions.getRandomInt(length_list);
            let key = Object.keys(this.album_list)[rand_album];
            let album = this.album_list[key];
            this.msg.channel.send(functions.Embeds.addFields(
                { name: "Your chosen album is...", value: album + "!!!" }
            ));
            this.msg.channel.send("<:hypers:784503728341647430>");
            delete this.album_list[key];

            if (Object.keys(this.album_list).length == 1)
                this.msg.channel.send("There is now " + Object.keys(this.album_list).length + " album in the list!");
            else
                this.msg.channel.send("There are now " + Object.keys(this.album_list).length + " albums in the list!");
    
        }
        else 
        {
            msg.channel.send("No albums in the list... Why not add your choice now!");
        }
    }
}