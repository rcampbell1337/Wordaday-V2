const functions = require("./core_methods");
const words = require("../Data/words");
const fetch = require('node-fetch');

// Handles definitions and random word generator for wordaday
module.exports = class Dictionary
{

    // Pass in the discord message parameter
    constructor(msg)
    {
        this.msg = msg;
    }

    /* This function gets data using a dictionary api and relays it into an embed, 
    using this function both word a day and define can be called. */
    
    async asyncApiCall(word) 
    {
        try 
        {
            const app_key = "75e25137-2b57-4012-8690-b7d8aec765f3";
            const url = `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${app_key}`;
            const response = await fetch(url);
            const json = await response.json();
            const values = json[0].meta;
            console.log(json);
            return this.msg.channel.send(functions.getEmbed().addFields({name: values.id, value: "\n" + json[0].hwi.prs[0].mw + "\n" + json[0].shortdef[0]}));
        } 
        catch
        {
            this.msg.reply("Yeah, sorry couldn't find that one :(");
        }
    };

    // Gets the definition of a word passed in by a user
    defineWord(args)
    {
        if (args[1]) 
        {
            this.asyncApiCall(args[1], "The definition of " + args[1] + " is:")
        }
        else 
        {
            msg.channel.send("Please enter a word to be defined")
        }
    }

    // Gets a random word for the user
    getRandomWord()
    {
        this.asyncApiCall(words[functions.getRandomInt(568)], "Your word today is:")
    }
}