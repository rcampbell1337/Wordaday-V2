const puppeteer = require("puppeteer");
const functions = require("./core_methods");

// The rock class handles the rock minigame
module.exports = class Rock 
{

    // Constuctor passes in the discord message param
    constructor(msg)
    {
        this.msg = msg;
        this.rock = "null";
    }

    // Set the rock value
    setRock(value) 
    {
        this.rock = value;
    }

    // Get the rock value
    getRock() 
    {
        return this.rock;
    }
    
    /* Scrape a website for one of the rocks that it has on its homepage,
    send the image that comes along with the rock with a question prompt   
    then set the value of the rock class with the chosen name */ 
    showRock()
    {
        let msg = this.msg;
        async function newProduct(url) 
        {
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto(url);
            const text = await page.evaluate(() => Array.from(document.querySelectorAll('.col3s'), element => element.textContent));
            const image = await page.evaluate(() => Array.from(document.querySelectorAll('.col3s'), element => element.getElementsByTagName("img")[0].src));
            let x = functions.getRandomInt(text.length);
            let newImageSize = image[x];

            msg.channel.send(functions.getEmbed().setImage(newImageSize).addFields(
                { name: "Guess the rock!!!", value: "WHAT COULD IT BE?! (Type your guess after the B!guess keyword!)" }
            ));
            this.setRock(text[x]);
            browser.close();
        }
        newProduct("https://geology.com/rocks/");
    }

    /* When the user uses the B!guess keyword it check to see if the 
    value of this.rock is the value they have entered, then returns a 
    response based on their answer */
    guessRock(args)
    {
        if (this.getRock() == "null") {
            this.msg.channel.send("Please ask for a Rock First...")
        }
        else if (args.length == 3 && args[1].toLowerCase() + " " + args[2].toLowerCase() == getRock().toLowerCase()) {
            this.msg.channel.send("Congratulations! The rock is " + getRock());
            this.setRock("null");
        }
        else if (args[1].toLowerCase() == getRock().toLowerCase()) {
            this.msg.channel.send("Congratulations! The rock is " + getRock());
            this.setRock("null");
        }
        else {
            this.msg.channel.send("OOOOF Close but no cigar! The rock was " + getRock());
            this.setRock("null");
        }
    }
}