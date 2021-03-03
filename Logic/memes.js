const functions = require("./core_methods")

// Class to send some of the worst functions i have made for wordaday
module.exports = class Memes
{

    // Pass in the discord message param
    constructor(msg)
    {
        this.msg = msg;
    }

    // Get a silly video
    getSimpVideo(args)
    {
        if (args[1]) {
            let name = new String(args[1]);
            this.msg.channel.send(name.valueOf() + ", You are a " + 'https://www.youtube.com/watch?v=7435xZZOzsY');
        }
        else {
            this.msg.channel.send("Please enter the simps username.")
        }
    }

    // Get a gif from jojo's Bizzarre adventure
    getJojoGIF()
    {
        let gifs = [
            "https://thumbs.gfycat.com/NiftySnarlingBluetickcoonhound-size_restricted.gif",
            "https://media2.giphy.com/media/Nn17cPRa7dZ28/giphy.gif",
            "https://i.kym-cdn.com/photos/images/original/001/204/072/6d2.gif",
            "https://media1.giphy.com/media/bC0caT4xYU8qQ/source.gif",
            "https://media1.tenor.com/images/71242474d0c209cfe775269ee2b9449b/tenor.gif?itemid=15487465",
            "https://media.giphy.com/media/IzfJSTepKi5vW/giphy.gif"
        ];
        this.msg.channel.send(gifs[functions.getRandomInt(6)]);
    }

    // Get a gif from OPM
    getOPMGIF()
    {
        let gifs = [
            "https://media3.giphy.com/media/4j1nGRNRIa3e0/source.gif",
            "https://i.gifer.com/JRW1.gif",
            "https://i.gifer.com/C5bV.gif",
            "https://pa1.narvii.com/6540/1671ee0151848ebce1408c7219305c070e5ee8ac_00.gif",
            "https://i.gifer.com/FODF.gif",
            "https://33.media.tumblr.com/07abdaa5439a9b4fb5532cd203238274/tumblr_nxiji1jyr21uzkymgo1_500.gif"
        ];
        this.msg.channel.send(gifs[functions.getRandomInt(6)]);
    }

    // Respond to people being mean
    getSucks()
    {
        this.msg.channel.send("I'm trying my best");
        this.msg.channel.send("<:struggle:778610140935880734>");
    }
}