const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'xpmessage',
  alias: ['xpm'],
  description: 'Configuration for the XP system',
  category: 'guildsettings',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send('Please use either `toggle` or `set`.');
    if (args[0] === 'toggle') {
      const current = client.botsettings.get(message.guild.id, 'xpMessage');
      client.botsettings.set(message.guild.id, !current, 'xpMessage');
      if (current === true) {
        message.channel.send(`The XP Messages have been turned off.`);
      } else if (current === false) {
        message.channel.send(`The XP Messages have been turned on.`);
      };
    } else if (args[0] === 'set') {
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(x => x.name.toLowerCase().includes(args[1])) || message.channel;
      if (channel.type === 'dm') return message.channel.send('You cant set the xp channel to a DM channel');
      if (channel.type === 'voice') return message.channel.send('You cant set the xp channel to a voice channel.');
      if (channel.type === 'category') return message.channel.send('You cant set the xp channel to a category.');
      const current = client.botsettings.get(message.guild.id, 'xpChannel');
      if (channel.id === current) return message.channel.send('That channel is already the xp channel.');
      if (!channel.permissionsFor(message.guild.me).has('SEND_MESSAGES')) message.channel.send('I cant send messages in that channel, if you want the xp messages to show please give me the permission to send messages in that channel.');
      client.botsettings.set(message.guild.id, channel.id, 'xpChannel');
      message.channel.send(`${channel} has been set to the XP Channel.`);
    };
  },
};