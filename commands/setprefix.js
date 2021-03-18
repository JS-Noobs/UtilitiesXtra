const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'setprefix',
  alias: ['prefix'],
  description: 'Sets a custom prefix for the server (default !)',
  category: 'botsettings',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const prefix = client.guildsettings.get(message.guild.id, 'prefix');
    if (!args[0]) return message.channel.send(`Usage: ${prefix}setprefix <prefix>`);
    if (args[0] === prefix) return message.channel.send(`The prefix is already ${prefix}`);
    const newPrefix = message.content.slice(prefix.length).split(/ +/)[1];
    if (newPrefix.length > 10) return message.channel.send(`The bots prefix can be maximum 10 of length.`);
    if (newPrefix.length < 1) return message.channel.send(`The bots prefix cant be less than 1 in length.`);
    if (newPrefix === '\u200b') return message.channel.send(`You cant use that as a bot prefix.`);

    client.guildsettings.set(message.guild.id, newPrefix, 'prefix');
    message.channel.send(`The new prefix for the bot is now ${newPrefix}`);
  },
};