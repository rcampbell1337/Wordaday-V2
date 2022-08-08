const puppeteer = require("puppeteer");
const functions = require("./core_methods");


// This class handles any webscraping standalone methods
module.exports = class Webscraper
{

    // Pass in the discord message param
    constructor(msg)
    {
        this.msg = msg;
    }

    // Gets a shakespearean insult from the internet
    getInsult(args)
    {
        let msg = this.msg;
        async function scrapeProduct(url) 
        {
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto(url);
            const txt = await page.evaluate(() => Array.from(document.getElementsByTagName("font"), element => element.textContent));
            if (args[1]) 
            {
                msg.channel.send(args[1] + ", " + txt[1]);
            }
            else 
            {
                msg.channel.send(txt[1]);
            }
            browser.close();
        }
        scrapeProduct("http://www.literarygenius.info/a2-shakespeare-insult-generator.htm")
    }

    // Get an inspirational quote from the internet
    getInspirationalQuote()
    {
        let msg = this.msg;

        async function motivateMe(url) 
        {
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto(url);
            const txt = await page.evaluate(() => Array.from(document.getElementsByTagName("strong"), element => element.textContent));
            let x = functions.getRandomInt(txt.length);
            msg.channel.send(functions.getEmbed().setImage("https://hofholistichealingcenters.files.wordpress.com/2012/10/inspired-life-1.jpg").addFields(
                { name: "Let's get inspired", value: txt[x] }
            ));
            browser.close();
        }
        motivateMe("https://personaldevelopfit.com/motivational-quotes/")
    }

    // Get a fact from the internet
    getCoolFact()
    {
        let msg = this.msg;

        async function teachMe(url) 
        {
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto(url);
            const txt = await page.evaluate(() => Array.from(document.querySelectorAll(".list"), element => element.textContent));
            let x = functions.getRandomInt(txt.length);
            msg.channel.send(functions.getEmbed().setImage("https://i.imgflip.com/2wakz3.png").addFields(
                { name: "To learn is to grow.", value: txt[x] }
            ));
            setTimeout(function () { msg.channel.send("<:thinking:778611853856997396>"); }, 2000);
            browser.close();
        }
        let page = functions.getRandomInt(6);
        teachMe(`https://www.thefactsite.com/1000-interesting-facts/${page}`)
    }
}
