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
    if(message.channel.permissionsFor(message.guild.id).has('SEND_MESSAGES')){
      message.channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: false
      });
    } else {
      message.channel.updateOverwrite(message.guild.id, {
        SEND_MESSAGES: true
      });
    };
  },
};