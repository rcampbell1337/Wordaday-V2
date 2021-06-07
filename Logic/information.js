const functions = require("./core_methods")

// This class contains all information relevant to wordaday
module.exports = class Information
{

    // Constructor passes in discord message param
    constructor (msg)
    {
        this.version = "3.0.2";
        this.msg = msg;
    }

    // Very simple hello function
    sayHello()
    {
        this.msg.channel.send('Hey ' + this.msg.member.user.username + ", What's up!")
    }

    // Method tells the user what the current version is or about me!
    getInformation(args)
    {

        // Display the current version
        if (args[1] === "version") 
        {
            this.msg.channel.send("Version " + this.version);
        }

        // Author info
        else if (args[1] === "author") 
        {
            let description = "This is my first attempt at a discord bot that i began creating out of frustration with the lack of bots who teach a word a day. \n" +
                "This current version does now features the 'word a day' function! Hooray! Soon it will be timestamped to produce one word a day, but not yet! As ever have fun and thanks " +
                "for using WordADay!"
            this.msg.channel.send(functions.Embeds.addField("About this bot", description))
        }

        // Error handling
        else 
        {
            this.msg.channel.send("Enter a second argument: author or version.");
        }
    }

    // Display all of the functions of wordaday
    getHelp()
    {
        this.msg.channel.send(functions.getEmbed().addFields(
            { name: "Command List", value: 'All commands start with B!' },
            { name: "Memes", value: "simp, jojo, opm, sucks" },
            { name: "Numerical functions", value: "bin, oct, hex" },
            { name: "Functionality", value: "info, help, hello, code, ping" },
            { name: "Albums", value: "album, generate_album" },
            { name: "Objects", value: "addobject, object" },
            { name: "Generate a random name", value: "add_person, select_person, reset" },
            { name: "Dictionary functions!", value: "word, define" },
            { name: "Play a game!", value: "rock" },
            { name: "Other Cool Stuff!!", value: "inspire, insult, fact, challenge" },
            { name: "Dice Rolls Type dice then:", value: "20, 12, 10, 8, 6, 4" }
        ));
    }

    // Do a ping test
    getPing(bot)
    {
        this.msg.channel.send(`🏓Latency is ${Date.now() - this.msg.createdTimestamp}ms. API Latency is ${Math.round(bot.ws.ping)}ms`);
    }
    
    // Very simple thankyou function
    sayThanks()
    {
        this.msg.channel.send("You're welcome chief!");
    }
}