const {MessageEmbed} = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
const monsters = require('../monsters.json');
const timeout = new Set();
module.exports = {
	name: 'messages',
  alias: ['msgs', 'messagecount', 'msgcount'],
	description: 'Show the amount of messages you have',
  category: 'misc',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    const key = `${message.guild.id}-${message.member.id}`;
    const embed = new MessageEmbed()
    .setTitle(`You have ${client.messages.get(key, 'total')} messages sent`)
    .setColor(`BLUE`)
    return message.channel.send(embed);
  },
};
