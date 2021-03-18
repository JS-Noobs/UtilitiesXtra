const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'invite',
  alias: ['inv'],
  description: 'Shows bot, server and support invite',
  category: 'bot',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    const createdInvite = await message.channel.createInvite({maxAge: 0});
    const invite = createdInvite.url
    const embed = new MessageEmbed()
    .setDescription(`[Support Discord](https://discord.gg/BbyWYAYabH "This will take you to the support server")\n[Invite Me!](https://top.gg/bot/780858079096995840/invite)\n[Server](${invite}"Invite to this server")`)
    .setColor('GREEN')
    return message.channel.send(embed)
  };