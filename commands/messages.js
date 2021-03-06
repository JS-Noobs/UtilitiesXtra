const { MessageEmbed } = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
const monsters = require('../monsters.json');
const timeout = new Set();
const ms = require('pretty-ms');
module.exports = {
  name: 'messages',
  alias: ['msgs', 'messagecount', 'msgcount'],
  description: 'Show the amount of messages you have',
  category: 'misc',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    const key = `${message.guild.id}-${message.member.id}`;
    const curDate = new Date()
    const date = new Date()
    const nextDay = new Date(client.messages.get(key, 'nextDay'));
    const msLeft = ms(nextDay - curDate, { secondsDecimalDigits: 0, millisecondsDecimalDigits: 0 })
    const embed = new MessageEmbed()
      .setDescription(`Total messages: ${client.messages.get(key, 'total')}\nDaily messages: ${client.messages.get(key, 'dailyMessages')}`)
      .setFooter(`${msLeft} until daily reset`)
      .setColor(`BLUE`)
    return message.channel.send(embed);
  },
};
