const functions = require('./core_methods');
const remove = require("../AWS/delete");
const save = require("../AWS/write");

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

                // Delete the message and save / update the database
                this.msg.channel.bulkDelete(1);
                save.save(this.msg.member.user.username, album_name);
                for(let i = 0; i < this.album_list.length; i++)
                {
                    if (this.album_list[i].discord_user == this.msg.member.user.username)
                    {
                        this.album_list.splice(i, 1);
                    }
                }
                this.album_list.push({
                    "discord_user": this.msg.member.user.username,
                    "album_name": album_name
                });
                console.log(this.album_list);
            }
        }
        else 
        {
            return this.msg.reply("You have already chosen an album.");
        }

        // Tell the user how many albums are in the object
        if (this.album_list.length == 1)
            this.msg.channel.send("There is now " + this.album_list.length + " album in the list!");
        else
            this.msg.channel.send("There are now " + this.album_list.length + " albums in the list!");
    }

    // Shows me who has submitted an album in the console and total submissions
    adminGetNames()
    {
        this.msg.channel.bulkDelete(1);
        this.album_list.forEach(element => console.log("User: " + element.discord_user));
        console.log("Total albums: " + this.album_list.length);
    }

    // Generates an album from the list already defined, then remove it
    generateAlbum()
    {

        // Get a random album, delete it and send it to users
        let length_list = this.album_list.length;
        if (length_list > 0)
        {
            let rand_album = functions.getRandomInt(length_list);
            let album = this.album_list[rand_album];

            // Send the album
            this.msg.channel.send(functions.getEmbed().addFields(
                { name: album.discord_user + " chose the album...", value: album.album_name }
            ));
            this.msg.channel.send("<:hypers:784503728341647430>");

            // Remove the album from the db and the local storage
            this.album_list.splice(rand_album, 1);
            remove.remove(album.discord_user);

            if (this.album_list.length == 1)
                this.msg.channel.send("There is now " + this.album_list.length + " album in the list!");
            else
                this.msg.channel.send("There are now " + this.album_list.length + " albums in the list!");
    
        }
        else 
        {
            this.msg.channel.send("No albums in the list... Why not add your choice now!");
        }
    }
}