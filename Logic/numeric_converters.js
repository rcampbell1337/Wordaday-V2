// This class converts numbers into computer science values
module.exports = class Converter
{

    // Constuctor passes in the discord message param
    constructor(msg)
    {
        this.msg = msg;
    }

    // Converts decimal to octal
    convertToOctal(args)
    {
        let oct = "";
        if (args[1]) 
        {
            oct = parseInt(args[1]).toString(8);
            this.msg.channel.send("The octal value of your number is " + oct);
        }
        else 
        {
            this.msg.channel.send("Please enter a second argument.")
        }
    }

    // Converts decimal to hexidecimal
    convertToHex(args)
    {
        let hexer = "";
        if (args[1]) 
        {
            hexer = parseInt(args[1]).toString(16).toUpperCase();
            this.msg.channel.send("The hexadecimal value of your number is " + hexer)
        }
        else 
        {
            this.msg.channel.send("Please input a number to convert.")
        }
    }

    // Converts a binary value to decimal 
    convertBinToDec(args)
    {
        if (args[1]) 
        {
            let digit = parseInt(args[1], 2)
            this.msg.channel.send("Your decimal number is " + String(digit));
        }
        else 
        {
            this.msg.channel.send("Please input a number to convert.");
        }
    }

    // Converts a decimal value to binary
    convertDecToBin(args)
    {

        // Reverses a string
        function reverse(s) 
        {
            return s.split("").reverse().join("");
        }

        let bin = ""
        if (args[1]) 
        {
            for (decimal = parseInt(args[1]); decimal >= 0; Math.floor(decimal -= decimal / 2)) 
            {
                if (decimal < 1) 
                {
                    continue;
                }
                else if (Math.floor(decimal) % 2 == 0) 
                {
                    bin = bin + "0"
                }
                else 
                {
                    bin = bin + "1"
                }
            }
            this.msg.channel.send("The binary value of your number is " + reverse(bin))
        }
    }
}