const functions = require("./core_methods");
const puppeteer = require("puppeteer");

module.exports = class Challenge {

    // Pass in the discord message parameter
    constructor(msg)
    {
        this.msg = msg;
    }

    // Scrape a coding challenge from the edabit website
    getChallenge(args)
    {

        // Define function vars
        let msg = this.msg;
        if (args[1])
        {
            args[1] = args[1].toLowerCase();
        }
        async function scrapeProduct(url) 
        {
            let options =[];

            // Create an instance of puppeteer
            const browser = await puppeteer.launch({ args: ['--no-sandbox', '--disable-setuid-sandbox'] });
            const page = await browser.newPage();
            await page.goto(url);
            await page.waitForSelector('a.content');
            let difficulties;

            // Get a random difficulty level coding challenge link from edabit
            await Promise.all([
                await page.waitForSelector('div.dropdown[style="margin-top: -2px;"]'),
                await page.click('div.dropdown[style="margin-top: -2px;"]'),
                await page.waitForSelector('div.visible.menu.transition'),
                difficulties = await page.$$('div.visible.transition div.item[aria-selected="false"][role="option"]'),
                await difficulties[functions.getRandomInt(difficulties.length)].click(),
                await page.waitForSelector('a.content'),

                // Push the final value into an array
                options.push(await page.evaluate(() => Array.from(document.querySelectorAll("a.content"), element => element.href)))
            ]);
            
            // Initialise the embedded response
            let response = functions.getEmbed().addFields({name: `${msg.member.user.username} your ${args[1]} challenge today is: `, value: `${options[0][functions.getRandomInt(options.length)]}\n GOOD LUCK!`});
            browser.close();

            // Set the image of the embed based on the input value
            switch(args[1])
            {
                case "python3":
                    response.setImage("https://c4.wallpaperflare.com/wallpaper/544/77/284/programming-programming-language-python-programming-logo-hd-wallpaper-preview.jpg");
                    break;
                
                case "cpp":
                    response.setImage("https://i.imgur.com/YC3uKyr.jpg");
                    break;

                case "java":
                    response.setImage("https://fiverr-res.cloudinary.com/images/t_main1,q_auto,f_auto,q_auto,f_auto/gigs/7218477/original/047b5a0671d407529c7a2e89d372e072d041bf80/do-cool-stuff-in-java-gwt-and-data-manipulation.jpg");
                    break;

                case "php":
                    response.setImage("https://besthqwallpapers.com/Uploads/18-2-2020/122121/thumb-php-glitter-logo-programming-language-grid-metal-background-php-creative.jpg");
                    break;

                case "csharp":
                    response.setImage("https://i.imgur.com/Jwl7Poj.jpg");
                    break;
            }

            // Send the challenge
            msg.channel.send(response);
        }

        // Create a list of the names the user can put in
        let possible_languages = ["php", "python3", "java", "cpp", "csharp"]

        // SUCCESS
        if (args[1] && possible_languages.includes(args[1]))
        {
            scrapeProduct(`https://edabit.com/challenges/${args[1]}`)
        }

        // MISTAKE
        else if (!possible_languages.includes(args[1]))
        {
            msg.channel.send(functions.getEmbed().setImage("https://media.istockphoto.com/videos/sad-man-crying-on-the-beach-video-id1067032786?s=640x640").addFields({name: "Oh no...", value: `Sorry, ${args[1]} isn't one of the options, you can choose from:\nPython3\nJava\nCPP\nCsharp\nJavascript\nand you shall be given a test!`}));
        }

        // INFORM THE USER
        else
        {
            msg.channel.send(functions.getEmbed().setImage("https://www.pandasecurity.com/en/mediacenter/src/uploads/2019/07/pandasecurity-How-do-hackers-pick-their-targets.jpg").addFields({name: "It seems you haven't entered a programming language!", value: "To get a challenge please type one of the following languages after B!challenge :\nPython3\nJava\nCPP\nCsharp\nJavascript\nand you shall be given a test!"}));
        }
   
    }
}