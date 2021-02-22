const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'logmessage',
  alias: ['lmsg', 'logsettings', 'lsettings'],
  description: 'Settings for the log message',
  category: 'guildsettings',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  development: false,
  ea: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please enter one of following options: \`toggle, list, channel\``);
    const key = message.guild.id;
    if (args[0] === 'toggle') {
      const cur = client.botsettings.get(key, 'sendLogs');
      client.botsettings.set(key, !cur, 'sendLogs');
      const embed = new MessageEmbed()
      if (!cur === true) {
        embed.setTitle(`Logs are now turned on.`)
          .setColor('GREEN')
      } else if (!cur === false) {
        embed.setTitle(`Logs are now turned off.`)
          .setColor('RED')
      };
      return message.channel.send(embed)
    } else if (args[0] === 'list') {
      let ignores = client.botsettings.get(key, 'ignoreRolesLog').map(x => message.guild.roles.cache.get(x).name);
      if (ignores.length <= 0) ignores = 'None';
      let ignores1 = client.botsettings.get(key, 'ignoreChannelsLog').map(x => message.guild.channels.cache.get(x).name);
      if (ignores1.length <= 0) ignores1 = 'None';
      let ignores2 = client.botsettings.get(key, 'ignoreUsersLog').map(x => message.guild.members.cache.get(x).name);
      if (ignores2.length <= 0) ignores2 = 'None';

      const embed = new MessageEmbed()
        .setTitle(`Ignored Logs`)
        .setDescription(`Logging channel: ${client.channels.cache.get(client.botsettings.get(message.guild.id, 'logChannel'))}`)
        .addField('Ignored roles', ignores)
        .addField('Ignored channels', ignores1)
        .addField('Ignored users', ignores2)

      return message.channel.send(embed)

    } else if (args[0] === 'channel') {
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(x => x.name.toLowerCase() === args[1]);

      client.botsettings.set(message.guild.id, channel.id, 'logChannel')
      const embed = new MessageEmbed()
        .setTitle(`Logchannel has been set to ${message.guild.channels.cache.get(client.botsettings.get(message.guild.id, 'logChannel')).name}`)
        .setColor('BLUE')

      return message.channel.send(embed);
    } else {
      return message.channel.send(`Please enter one of following options: \`toggle, list, channel\``)
    }
  },
};