const functions = require('./core_methods');
const FilmDatabase = require('../DynamoDB/DataHelpers/film_database');

// This class contains all of the film selectiong methods
module.exports = class Film 
{

    // Pass in the discord message parameter
    constructor(msg, film_list)
    {
        this.msg = msg;
        this.film_list = film_list;
        this.film_database = new FilmDatabase();
    }

    // Adds a film to the list
    async addFilm(args)
    {

        // See if the user has submitted an film
        const user_in_list = () => {
            for(let i = 0; i < this.film_list.length; i++)
            {
                if (this.film_list[i].discord_user == this.msg.member.user.username)
                {
                    return true;
                }
            }
            return false;
        } 
        
        let check_for_user = user_in_list();


        if (!args[1]) return this.msg.reply("Error, please enter a film title");
        else 
        {
            let film_name = "";
            for (let arg in args)
            {
                if (arg > 0)
                {
                    film_name += args[arg] + " ";
                }
            }

            // Delete the message and save / update the database
            this.msg.channel.bulkDelete(1);
            for(let i = 0; i < this.film_list.length; i++)
            {
                if (this.film_list[i].discord_user == this.msg.member.user.username)
                {
                    this.film_list.splice(i, 1);
                }
            }
            let data = {
                "discord_user": this.msg.member.user.username,
                "film_name": film_name
            }

            this.film_database.write(data);

            this.film_list.push(data);
        }

        // Tells the user if it an update or if it is a new film
        if (!check_for_user)
        {
            this.msg.channel.send(this.msg.member.user.username + " has entered a new choice!")

            // Tell the user how many films are in the object
            if (this.film_list.length == 1)
                this.msg.channel.send("There is now " + this.film_list.length + " film in the list!");
            else
                this.msg.channel.send("There are now " + this.film_list.length + " films in the list!");
        }

        else 
        {
            this.msg.channel.send(this.msg.member.user.username + " has updated their choice!");
        }
    }

    // Shows me who has submitted an film in the console and total submissions
    adminGetNames()
    {
        this.msg.channel.bulkDelete(1);
        this.film_list.forEach(element => console.log("User: " + element.discord_user));
        console.log("Total films: " + this.film_list.length);
    }

    // Generates an film from the list already defined, then remove it
    generateFilm()
    {

        let length_list = this.film_list.length;
        let msg = this.msg;
        let rand_film = functions.getRandomInt(length_list);
        let film = this.film_list[rand_film];
        if (length_list > 0)
        {
                msg.channel.send(functions.getEmbed().setImage('https://3.bp.blogspot.com/-KfQ7L93k7bk/Wdl1C58FHuI/AAAAAAADu40/iU6YuibBmnEx65n5L8yrJ0xzOZoe-hr2QCLcBGAs/s320/tenor%2B%25283%2529.gif')
                .setTitle(film.discord_user + " chose the film...")
                .setDescription(film.film_name )
                .setThumbnail(null)
                .setFooter('Have fun with it!', 'https://i.pinimg.com/736x/3c/88/c8/3c88c8510028f627cf58792795629ed1.jpg'));

                // Remove the film from the db and the local storage
                this.film_list.splice(rand_film, 1);
                this.film_database.remove(film.discord_user);

                if (this.film_list.length == 1) {
                    msg.channel.send("There is now " + this.film_list.length + " film in the list!");
                }
                else {
                    msg.channel.send("There are now " + this.film_list.length + " films in the list!");
                }
        }
        else 
        {
            this.msg.channel.send("No films in the list... Why not add your choice now!");
        }
    }
}