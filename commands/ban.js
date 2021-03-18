const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'ban',
  alias: [],
  description: 'Bans members.',
  category: 'moderation',
  permissions: ['BAN_MEMBERS'],
  botpermissions: ['BAN_MEMBERS'],
  developer: false,
  execute: async (message, args, client) => {
    if (!args[0]) return message.channel.send(`Please mention a member to ban`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase().startsWith(args[0]));
    const exe = message.member;
    const bot = message.guild.me;

    if (!member) return message.channel.send(`No valid member was found.`);

    if (member.id === message.guild.ownerID) return message.channel.send(`You can't ban the owner.`);
    if (member.id === exe.id) return message.channel.send(`You can't ban yourself.`);
    if (member.id === bot.id) return message.channel.send(`I can't ban myself.`);
    if (member.roles.highest.position >= exe.roles.highest.position) return message.channel.send(`You can't ban someone with a higher than or equal role to yours.`);
    if (member.roles.highest.position >= bot.roles.highest.position) return message.channel.send(`I can't ban someone with a higher than or equal role to mine.`);

    const reason = args.slice(1).join(' ') || `${member} was banned from ${message.guild.name}`;

    async function ban() {
      try {
        await member.send(`You have been banned from ${message.guild.name}\nReason: ${reason}`);
        await message.channel.send(`${member} banned\nReason: ${reason}`);
        member.ban();
      } catch {
        await message.channel.send(`${member} banned\nReason: ${reason}`);
        member.ban();
      };
      client.emit('logger', 'Banned Member', message.author.tag, member.user.tag, reason, null, 'ban', message.url, message.guild.id);
    };
    ban()
  },
};