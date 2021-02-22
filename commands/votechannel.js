const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'vote',
  alias: [],
  description: 'Vote channel settings for setting what channels should be used as voting channels',
  category: 'guildsettings',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  development: false,
  ea: false,
  execute(message, args, client) {
    if (!args[0]) {
      const embed = new MessageEmbed()
        .setTitle(`Please use on of following options`)
        .addField(`channel {add|remove}`, 'add or remove a channel to the vote channel list')

      return message.channel.send(embed);
    };

    if (args[0] === 'channel') {
      if (!args[1]) return message.channel.send(`Invalid option please use either "add" or "remove"`)
      if (args[1] === 'add') {
        if (!args[2]) return message.channel.send(`Please mention the channel to add`)
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find(x => x.name.toLowerCase().includes(args[2]));
        if (!channel) return message.channel.send(`${args[2]} is not a valid channel`)
        if (client.votechannels.get(message.guild.id, 'channels').includes(channel.id)) return message.channel.send(`That channel is already a voting channel`)
        client.votechannels.push(message.guild.id, channel.id, 'channels');
        return message.channel.send(`${channel} has been added as a voting channel`)
      } else if (args[1] === 'remove') {
        if (!args[2]) return message.channel.send(`Please mention the channel to remove`)
        const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[2]) || message.guild.channels.cache.find(x => x.name.toLowerCase().includes(args[2]));
        if (!channel) return message.channel.send(`${args[2]} is not a valid channel`)
        if (!client.votechannels.get(message.guild.id, 'channels').includes(channel.id)) return message.channel.send(`That channel is not a voting channel`)
        client.votechannels.remove(message.guild.id, channel.id, 'channels');
        return message.channel.send(`${channel} has been removed from the voting channels`)
      } else if (!args[1] || !['add', 'remove'].includes(args[1])) {
        return message.channel.send(`Invalid option please use either "add" or "remove"`)
      }
    } else {
      const embed = new MessageEmbed()
        .setTitle(`Please use the following format`)
        .addField(`channel {add|remove}`, 'add or remove a channel to the vote channel list')

      return message.channel.send(embed);
    }
  },
};