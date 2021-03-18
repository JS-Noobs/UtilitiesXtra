const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const recipes = require('../recipes.json')

module.exports = {
  name: 'recipes',
  alias: ['recipe'],
  description: 'Shows the recipes for items',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    let page = parseInt(args[0]) || 1;
    const arr2 = recipes;
    const total = recipes.length;

    if (page > Math.ceil(total / 9)) page = Math.ceil(total / 9)

    const a = []
    arr2.forEach(x => a.push(x));
    const arr = a.sort((x, y) => x.result).sort((a, b) => {
      let fa = a.result.toLowerCase();
      let fb = b.result.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    }).splice(page * 9 - 9, 9)

    const embed = new MessageEmbed()
      .setTitle('Recipes')
    arr.forEach(x => {
      embed.addField(x.result, `${x.requirements.map(y => `${y.amount}: ${y.item}`).join(', \n')}`, true)
    })
    embed.setFooter(`Page ${page}/${Math.ceil(total / 9)}`);

    message.channel.send(embed)
  },
};