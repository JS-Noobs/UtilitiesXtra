const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');
module.exports = {
	name: 'adventure',
  alias: ['av'],
	description: 'Start an adventure',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
     const msg = await message.channel.send(`Pinging...`);
     await ping = ms(Date.now - msg.createdAt);
     const embed = new MessageEmbed()
     .setTitle(`Ping`)
     .setDescription(`:ping_pong: ${ping}\n:heartbeat: ${client.ws.ping}`)
     .setColor('GREEN')
     message.channel.send(embed)
  },
};
