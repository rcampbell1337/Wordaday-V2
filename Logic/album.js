const functions = require('./core_methods');
const AlbumDatabase = require('../DynamoDB/DataHelpers/album_database');

// This class contains all of the album selectiong methods
module.exports = class Album 
{

    // Pass in the discord message parameter
    constructor(msg, album_list)
    {
        this.msg = msg;
        this.album_list = album_list;
        this.album_database = new AlbumDatabase();
    }

    // Adds an album to the list
    async addAlbum(args)
    {

        // See if the user has submitted an album
        const user_in_list = () => {
            for(let i = 0; i < this.album_list.length; i++)
            {
                if (this.album_list[i].discord_user == this.msg.member.user.username)
                {
                    return true;
                }
            }
            return false;
        } 
        
        let check_for_user = user_in_list();


        if (!args[1]) return this.msg.reply("Error, please enter an album title");
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
            for(let i = 0; i < this.album_list.length; i++)
            {
                if (this.album_list[i].discord_user == this.msg.member.user.username)
                {
                    this.album_list.splice(i, 1);
                }
            }
            let data = {
                "discord_user": this.msg.member.user.username,
                "album_name": album_name
            }

            this.album_database.write(data);

            this.album_list.push(data);
        }

        // Tells the user if it an update or if it is a new album
        if (!check_for_user)
        {
            this.msg.channel.send(this.msg.member.user.username + " has entered a new choice!")

            // Tell the user how many albums are in the object
            if (this.album_list.length == 1)
                this.msg.channel.send("There is now " + this.album_list.length + " album in the list!");
            else
                this.msg.channel.send("There are now " + this.album_list.length + " albums in the list!");
        }

        else 
        {
            this.msg.channel.send(this.msg.member.user.username + " has updated their choice!");
        }
    }

    // Shows me who has submitted an album in the console and total submissions
    adminGetNames()
    {
        this.msg.channel.bulkDelete(1);
        this.album_list.forEach(element => console.log("User: " + element.discord_user));
        console.log("Total albums: " + this.album_list.length);
    }

    // // Generates an album from the list already defined, then remove it
    // generateAlbum()
    // {

    //     // Get a random album, delete it and send it to users
    //     let length_list = this.album_list.length;
    //     if (length_list > 0)
    //     {
    //         let rand_album = functions.getRandomInt(length_list);
    //         let album = this.album_list[rand_album];

    //         // Send the album
    //         this.msg.channel.send(functions.getEmbed().setImage()
    //         .setTitle(album.discord_user + " chose the album...")
    //         .setDescription(album.album_name )
    //         .setThumbnail(null)
    //         .setFooter('Have fun with it!', 'https://i.pinimg.com/736x/3c/88/c8/3c88c8510028f627cf58792795629ed1.jpg')
    //         );
    //         this.msg.channel.send("<:hypers:784503728341647430>");

    //         // Remove the album from the db and the local storage
    //         this.album_list.splice(rand_album, 1);
    //         remove.remove(album.discord_user);

    //         if (this.album_list.length == 1)
    //             this.msg.channel.send("There is now " + this.album_list.length + " album in the list!");
    //         else
    //             this.msg.channel.send("There are now " + this.album_list.length + " albums in the list!");
    
    //     }
    //     else 
    //     {
    //         this.msg.channel.send("No albums in the list... Why not add your choice now!");
    //     }
    // }

    // Generates an album from the list already defined, then remove it
    generateAlbum()
    {

        let length_list = this.album_list.length;
        let msg = this.msg;
        let rand_album = functions.getRandomInt(length_list);
        let album = this.album_list[rand_album];
        if (length_list > 0)
        {
                msg.channel.send(functions.getEmbed().setImage('https://i.pinimg.com/originals/83/f6/23/83f623246c3043e74f2c1bc6bae1ef8d.jpg')
                .setTitle(album.discord_user + " chose the album...")
                .setDescription(album.album_name )
                .setThumbnail(null)
                .setFooter('Have fun with it!', 'https://i.pinimg.com/736x/3c/88/c8/3c88c8510028f627cf58792795629ed1.jpg'));

                // Remove the album from the db and the local storage
                this.album_list.splice(rand_album, 1);
                this.album_database.remove(album.discord_user);

                if (this.album_list.length == 1) {
                    msg.channel.send("There is now " + this.album_list.length + " album in the list!");
                }
                else {
                    msg.channel.send("There are now " + this.album_list.length + " albums in the list!");
                }
        }
        else 
        {
            this.msg.channel.send("No albums in the list... Why not add your choice now!");
        }
    }
}