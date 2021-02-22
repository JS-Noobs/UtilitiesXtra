const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'tempban',
  alias: [],
  description: 'Temporary bans a member from the server',
  category: 'moderation',
  permissions: ['BAN_MEMBERS'],
  botpermissions: ['BAN_MEMBERS'],
  development: false,
  ea: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please mention a member to tempban`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase().startsWith(args[0]));
    const exe = message.member;
    const bot = message.guild.me;

    if (!member) return message.channel.send(`No valid member was found.`);

    if (member.id === message.guild.ownerID) return message.channel.send(`You can't tempban the owner.`);
    if (member.id === exe.id) return message.channel.send(`You can't tempban yourself.`);
    if (member.id === bot.id) return message.channel.send(`I can't tempban myself.`);
    if (member.roles.highest.position >= exe.roles.highest.position) return message.channel.send(`You can't tempban someone with a higher than or equal role to yours.`);
    if (member.roles.highest.position >= bot.roles.highest.position) return message.channel.send(`I can't tempban someone with a higher than or equal role to mine.`);

    if (!args[1]) return message.channel.send(`Please specfy time to tempban the member for.`);
    let muteTime = args[1];
    let endMute = new Date();
    if (isNaN(parseInt(muteTime))) return message.channel.send(`${muteTime} is not a valid time, use (s, m, h, d) to choose format.`);
    if (muteTime.includes('s')) {
      muteTime = 1000 * parseInt(muteTime);
      endMute.setSeconds(endMute.getSeconds() + parseInt(args[1]));
    } else if (muteTime.includes('m')) {
      muteTime = 1000 * 60 * parseInt(muteTime);
      endMute.setMinutes(endMute.getMinutes() + parseInt(args[1]));
    } else if (muteTime.includes('h')) {
      muteTime = 1000 * 60 * 60 * parseInt(muteTime);
      endMute.setHours(endMute.getHours() + parseInt(args[1]));
    } else if (muteTime.includes('d')) {
      muteTime = 1000 * 60 * 60 * 24 * parseInt(muteTime);
      endMute.setDate(endMute.getDate() + parseInt(args[1]));
    } else {
      return message.channel.send(`${muteTime} could not be formatted to a time.`)
    };
    const key = `${message.guild.id}-${member.id}`;
    client.tempban.ensure(key, {
      unmuteDate: endMute,
      member: member.id,
      guild: message.guild.id
    });

    const reason = args.slice(2).join(' ') || `${member} was temporary banned for ${ms(muteTime, { long: true })}.`;

    async function tempban() {
      await member.send(`Ỳou have been temporary banned in ${message.guild.name} for ${ms(muteTime, { long: true })}\nReason: ${reason}`);
      await message.channel.send(`${member} was temporary banned for ${ms(muteTime, { long: true })}\nReason: ${reason}`);
      member.ban();
      setTimeout(() => {
        message.guild.members.unban(member.id);
        member.send(`You have been unbanned in ${message.guild.name}.`);
        client.tempban.delete(key);
      }, muteTime);
      client.emit('logger', 'Temporary Banned', message.author.tag, member.user.tag, reason, ms(muteTime), 'tempban', message.url, message.guild.id);
    };
    tempban();
  },
};