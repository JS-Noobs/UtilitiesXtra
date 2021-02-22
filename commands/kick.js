const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kick',
  alias: [],
  description: 'Kicks members.',
  category: 'moderation',
  permissions: ['KICK_MEMBERS'],
  botpermissions: ['KICK_MEMBERS'],
  development: false,
  ea: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please mention a member to kick`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase().startsWith(args[0]));
    const exe = message.member;
    const bot = message.guild.me;

    if (!member) return message.channel.send(`No valid member was found.`);

    if (member.id === message.guild.ownerID) return message.channel.send(`You can't kick the owner.`);
    if (member.id === exe.id) return message.channel.send(`You can't kick yourself.`);
    if (member.id === bot.id) return message.channel.send(`I can't kick myself.`);
    if (member.roles.highest.position >= exe.roles.highest.position) return message.channel.send(`You can't kick someone with a higher than or equal role to yours.`);
    if (member.roles.highest.position >= bot.roles.highest.position) return message.channel.send(`I can't kick someone with a higher than or equal role to mine.`);

    const reason = args.slice(1).join(' ') || `${member} was kicked from ${message.guild.name}`;

    async function kick() {
      try {
        await member.send(`You have been kicked from ${message.guild.name}\nReason: ${reason}`);
        await message.channel.send(`${member} kicked\nReason: ${reason}`);
        member.kick();
      } catch {
        await message.channel.send(`${member} kicked\nReason: ${reason}`);
        member.kick();
      };
      client.emit('logger', 'Kicked Member', message.author.tag, member.user.tag, reason, null, 'kick', message.url, message.guild.id);
    };
    kick()
  },
};