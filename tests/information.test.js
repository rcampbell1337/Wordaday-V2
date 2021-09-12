const { group, test, command, beforeStart, afterAll, expect } = require("corde");
// You can also import const corde = require("corde"); This is a default export with all others
// functions.
const { Bot } = require("../Logic/bot");

beforeStart(() => {
    const new_bot = new Bot();
    new_bot.bot_on();
  });
  
  test("The version should return 'Version 3.0.2'"), () => {
    expect("info version").toReturn("Version 3.0.2");
  }
  
  afterAll(() => {
    new_bot.destroy();
  });