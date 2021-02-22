const { MessageEmbed } = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
module.exports = {
  name: 'adventureinfo',
  alias: ['avinfo', 'avi'],
  description: 'Shows your adventuring stats',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
  execute: async (message, args, client) => {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0]) || message.member;
    const key = `${message.guild.id}-${member.id}`;
    const stats = client.adventure.get(key);
    let monster = stats.monster;
    if (monster.length <= 0) monster = 'No monster'

    let bonus = 1;
    if (client.stats.get(key, 'luck') >= 1) Math.abs(client.stats.get(key, 'luck') * 15) / 10;

    const embed = new MessageEmbed()
      .setTitle(`${message.author.tag}'s adventure stats`)
      .addField(`Highest level`, stats.highestLvl, true)
      .addField(`Current level`, stats.level, true)
      .addField(`Difficulty modifier`, stats.difficulty, true)
      .addField(`Money gain (x${1 + (stats.difficulty / 10 + bonus)})`, stats.moneyreward, true)
      .addField(`Xp gain (x${1 + (stats.difficulty / 10 + bonus)})`, stats.xp, true)
      .addField(`Lifes`, stats.lifes, true)

    message.channel.send(embed)
  },
};