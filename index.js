/*
   Author: Robbie Campbell
   Date: 03/03/2021
   Description:
   It's been almost a year now since i first took on wordaday, and what a
   journey it's been. At it's conception, it could only say hello and
   thankyou (wow), then it could send gifs in discord chats (amazing),
   THEN i implemented the illustrious wordaday function (!!!), but there was one major problem...
   the code was a bloody mess. It's been a year, and looking at wordadays
   source code (here: https://github.com/Robbie-Campbell/Discord-Bot) just isn't
   pleasant, in fact, it verges on disgusting with how messy it is.
   So on this day i have reignited my love for our bot friend by utilising
   node and js' object oriented functionality, and wow, does wordaday look good!
   Please enjoy wordaday, i certainly have. Happy coding one and all!
   */

const bot = require('./Logic/bot');

const new_bot = new bot();
new_bot.bot_on();