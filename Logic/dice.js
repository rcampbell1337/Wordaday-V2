const functions = require("./core_methods");

// Return different dungeons and dragons dice rolls
module.exports = class Dice
{

    // Constuctor passes in the discord message param
    constructor(msg)
    {
        this.msg = msg;
    }

    // Decides which dice to roll based on the second parameter
    getDice(args)
    {
        switch (args[1]){

            // A selection of dice rolls for different numbers
            // D20
            case "20":
                let x = functions.getRandomInt(20) + 1;
                if (x == 20) {
                    this.msg.channel.send(x);
                    this.msg.channel.send("<:nice:783687286650830919>");
                    break;
                }
                else {
                    this.msg.channel.send(x);
                    break;
                }
            
            // D12
            case "12":
                this.msg.channel.send(functions.getRandomInt(12) + 1);
                break;
            
            // D10
            case "10":
                this.msg.channel.send(functions.getRandomInt(10) + 1);
                break;
            
            // D8
            case "8":
                this.msg.channel.send(functions.getRandomInt(8) + 1);
                break;
            
            // D6
            case "6":
                this.msg.channel.send(functions.getRandomInt(6) + 1);
                break;
            
            // D4
            case "4":
                this.msg.channel.send(functions.getRandomInt(4) + 1);
                break;
        }
    }
}