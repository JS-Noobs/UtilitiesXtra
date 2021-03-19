const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
module.exports = {
  name: 'ping',
  alias: [],
  description: 'Shows bot ping and heartbeat',
  category: 'misc',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    const msg = await message.channel.send(`Pinging...`);
    const ping = await Date.now() - msg.createdAt;
    msg.delete()
    const embed = new MessageEmbed()
      .setTitle(`Ping`)
      .setDescription(`:ping_pong: ${ping}ms or ${ping / 1000}s\n:heartbeat: ${client.ws.ping}ms or ${client.ws.ping / 1000}s`)
      .setColor('GREEN')
    message.channel.send(embed);
  },
};
