const functions = require('./core_methods');

// This class takes in people and generates a random one
module.exports = class RandomPerson
{
    // Constuctor passes in the discord message param
    constructor(msg, person_list)
    {
        this.msg = msg;
        this.person_list = person_list;
    }

    // Insert a person into the temporary list
    insertPerson(args)
    {
        let person = "";
        for (let arg in args)
        {
            if (arg > 0)
            {
                person += args[arg] + " ";
            }
        }
        this.person_list.push(person);
        this.msg.channel.send(person + "added!");
    }

    // Gets a random person from the list
    selectPerson()
    {
        if (this.person_list.length > 0)
        {
            let person_index = functions.getRandomInt(this.person_list.length);
            this.msg.channel.send(this.person_list[person_index] + "has been selected!");
            this.person_list.splice(person_index, 1);
        }
        else
        {
            this.msg.channel.send("There is no one in the list, you silly goose");
        }
    }

    // Resets the list
    reset()
    {
        this.person_list.splice(0, this.person_list.length);
        this.msg.channel.send("List has been reset");
    }
}