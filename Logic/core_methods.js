const Discord = require('discord.js');

// Creates an embed option, abitlity to change aspects will be added later
function getEmbed()
{    
    return new Discord.MessageEmbed()
           .setColor('#DD4444')
           .setTitle('WordADay bot')
           .setURL('https://www.youtube.com/channel/UCH_bkDYstaTtrHmDN-8Hb3w')
           .setAuthor('Robbie C', 'https://i.pinimg.com/736x/3c/88/c8/3c88c8510028f627cf58792795629ed1.jpg', 'https://www.youtube.com/channel/UCH_bkDYstaTtrHmDN-8Hb3w')
           .setDescription("The bot that'll read you a word a day!")
           .setThumbnail('https://i.pinimg.com/736x/3c/88/c8/3c88c8510028f627cf58792795629ed1.jpg')
           .setImage('https://cdn.discordapp.com/attachments/571058265404997657/707298692843176077/Bilbo_Rabbins.jpg')
           .setFooter('Have fun with it!', 'https://i.pinimg.com/736x/3c/88/c8/3c88c8510028f627cf58792795629ed1.jpg');
}

// Gets a random number
function getRandomInt(max)
{
    return Math.floor(Math.random() * Math.floor(max));
}

exports.getEmbed = getEmbed;
exports.getRandomInt = getRandomInt;