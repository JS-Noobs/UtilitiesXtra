const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'lockdown',
  alias: [],
  description: 'Locks a channel.',
  category: 'moderation',
  permissions: ['MANAGE_CHANNEL'],
  botpermissions: ['MANAGE_CHANNEL'],
  development: false,
  ea: false,
  execute(message, args, client) {
    const embed = new MessageEmbed()
    if(message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES')){
      message.channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: false
      });
      embed.setTitle(`Channel is now locked 🔒`)
      .setColor('RED')
      message.channel.send(embed);
    } else {
      message.channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: true
      });
      embed.setTitle(`Channel is now unlocked 🔓`)
      .setColor('GREEN')
      message.channel.send(embed);
    };
  },
};