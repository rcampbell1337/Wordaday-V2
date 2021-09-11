const axios = require("axios");
const functions = require("./core_methods");

module.exports = class SmashAPI {
    constructor(msg) {
        this.msg = msg;
    }

    getAllCharacterNames(words) {
        return words.slice(1).join("");
    }

    makeRequestToSmashAPI(character_name) {
        let character_name_for_api = this.getAllCharacterNames(character_name);
        character_name = character_name.join(" ");
        let api_url = `https://api.kuroganehammer.com/api/characters/name/${character_name_for_api}/movements`;
        console.log(api_url);
        axios.get(api_url).then(response => {
            if (response.data.length > 0 && response.status == 200) {
                let character_data = "";
                for (let i = 0; i < response.data.length; i++) {
                    character_data += `${response.data[i]['Name']}: ${response.data[i]['Value']}\n`
                }
                this.msg.channel.send(functions.getEmbed().setImage("https://cdn02.nintendo-europe.com/media/images/10_share_images/games_15/nintendo_switch_4/H2x1_NSwitch_SuperSmashBrosUltimate_02_image1600w.jpg")
                                        .addFields({name: `Here's all the stats for ${character_name}!`, value: character_data}));
            }
            else {
                this.msg.channel.send(`Sorry, i could not find any smash data for ${character_name}`);
            }
          })
          .catch(error => {
            console.log(error);
          });
    }
}