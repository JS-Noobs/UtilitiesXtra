const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');
module.exports = {
	name: 'ping',
  alias: [],
	description: 'Shows bot ping and heartbeat',
  category: 'bot',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
     const msg = await message.channel.send(`Pinging...`);
     const ping = await ms(Date.now() - msg.createdAt);
     const embed = new MessageEmbed()
     .setTitle(`Ping`)
     .setDescription(`:ping_pong: ${ping}\n:heartbeat: ${client.ws.ping}ms`)
     .setColor('GREEN')
     msg.edit(embed)
  },
};
