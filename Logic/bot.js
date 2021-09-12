// Sets up the bot for the apps
require('dotenv').config();
const album_index = require("../AlbumDatabase/index");
const object_index = require("../ObjectDatabase/index");
const Discord = require('discord.js');
const Rock = require('./rock');
const Dictionary = require('./dictionary');
const Information = require('./information');
const Memes = require('./memes');
const Dice = require('./dice');
const Converter = require('./numeric_converters')
const Album = require('./album')
const Webscraper = require('./webscrape_functions')
const Challenge = require('./challenges')
const RandomObject = require('./random_object');
const SmashAPI = require('./smash_ultimate');

// Override the flat function not available to discord current version
Object.defineProperty(Array.prototype, 'flat', {
    value: function (depth = 1) {
        return this.reduce(function (flat, toFlatten) {
            return flat.concat((Array.isArray(toFlatten) && (depth > 1)) ? toFlatten.flat(depth - 1) : toFlatten);
        }, []);
    }
});

// The main bot class
module.exports = class Bot
{

    // Turns on the bot and defines parameters
    constructor()
    {
        this.prefix = "b!";
        this.token = process.env.BOT_VAR;
        this.client = new Discord.Client();
        this.client.login(this.token);
        this.client.on('ready', () => {
            console.log("This bot is online");
        });
        
        this.album_list;
        this.object_list;

        // Convert the promise into a usable dictionary
        (async () => {
            this.album_list = await album_index();
            this.object_list = await object_index();
            console.log(this.object_list.length);
            console.log("There are already " + this.album_list.length + " albums in the list!")
        })();
    };

    // Handles all prompts from the user
    bot_on()
    {
        // When a message is sent
        this.client.on('message', msg => 
        {

            // Create instances of all classes
            const rock = new Rock(msg);
            const dictionary = new Dictionary(msg);
            const information = new Information(msg);
            const memes = new Memes(msg);
            const dice = new Dice(msg);
            const converter = new Converter(msg);
            const album = new Album(msg, this.album_list);
            const webscraper = new Webscraper(msg);
            const challenge = new Challenge(msg);
            const random_person = new RandomObject(msg, this.object_list);
            const smash_data = new SmashAPI(msg);

            // Create a list of arguments for the switch statement
            let args = ["none"];
            if (msg.content.toLowerCase().includes(this.prefix)) 
            {
                args = msg.content.slice(this.prefix.length).split(" ");
            }

            switch (args[0].toLowerCase())
            {

                // Wordaday functions
                case "word":
                    dictionary.getRandomWord();
                    break;

                case "define":
                    dictionary.defineWord(args);
                    break;

                // Rock game functions
                case "rock":
                    rock.showRock();
                    break;

                case "guess":
                    rock.guessRock(args);
                    break;

                // Information functions
                case "info":
                    information.getInformation(args);
                    break;

                case "hello":
                    information.sayHello();
                    break;
                
                case "help":
                    information.getHelp();
                    break;
                
                case "ping":
                    information.getPing(this.bot);
                    break;

                case "thanks":
                    information.sayThanks();
                    break;

                // Meme functions
                case "jojo":
                    memes.getJojoGIF();
                    break;
                
                case "opm":
                    memes.getOPMGIF();
                    break;
                
                case "simp":
                    memes.getSimpVideo(args);
                    break;
                
                case "sucks":
                    memes.getSucks();
                    break;

                // Dice rolls
                case "dice":
                    dice.getDice(args);
                    break;

                // Numeric converter functions
                case "bin":
                    converter.convertBinToDec(args);
                    break;
                
                case "oct":
                    converter.convertToOctal(args);
                    break;
                
                case "hex":
                    converter.convertToHex(args);
                    break;

                case "dec":
                    converter.convertDecToBin(args);
                    break;

                // Album functions
                case "album":
                    album.addAlbum(args);
                    break;

                case "admin_get_names":
                    album.adminGetNames();
                    break;

                case "generate_album":
                    album.generateAlbum();
                    break;

                // Webscraping functions
                case "fact":
                    webscraper.getCoolFact();
                    break;
                
                case "inspire":
                    webscraper.getInspirationalQuote();
                    break;

                case "insult":
                    webscraper.getInsult(args);
                    break;

                // Coding challenges
                case "challenge":
                    challenge.getChallenge(args);
                    break;

                // Random person list
                case "addobject":
                    random_person.insertObject(args);
                    break;

                case "object":
                    random_person.selectObject();
                    break;
                
                case "smash":
                    smash_data.makeRequestToSmashAPI(args);
                    break;

            }
        })
    }
}