const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
	name: 'mute',
  alias: ['silence'],
	description: 'Mutes members.',
  category: 'moderation',
  permissions: ['MANAGE_ROLES'],
  botpermissions: ['MANAGE_ROLES'],
  development: false,
  ea: false,
	execute(message, args, client) {
    if(!args[0]) return message.channel.send(`Please mention a member to mute`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase().startsWith(args[0]));
    const exe = message.member;
    const bot = message.guild.me;

    if(!member) return message.channel.send(`No valid member was found.`);

    if(member.id === message.guild.ownerID) return message.channel.send(`You can't mute the owner.`);
    if(member.id === exe.id) return message.channel.send(`You can't mute yourself.`);
    if(member.id === bot.id) return message.channel.send(`I can't mute myself.`);
    if(member.roles.highest.position >= exe.roles.highest.position) return message.channel.send(`You can't mute someone with a higher than or equal role to yours.`);
    if(member.roles.highest.position >= bot.roles.highest.position) return message.channel.send(`I can't mute someone with a higher than or equal role to mine.`);

    if(!args[1]) return message.channel.send(`Please specfy time to mute the member for.`);
    let muteTime = args[1];
    let endMute = new Date();
    if(isNaN(parseInt(muteTime))) return message.channel.send(`${muteTime} is not a valid time, use (s, m, h, d) to choose format.`);
    if(muteTime.includes('s')){
      muteTime = 1000 * parseInt(muteTime);
      endMute.setSeconds(endMute.getSeconds() + parseInt(args[1]));
    } else if(muteTime.includes('m')){
      muteTime = 1000 * 60 * parseInt(muteTime);
      endMute.setMinutes(endMute.getMinutes() + parseInt(args[1]));
    } else if(muteTime.includes('h')){
      muteTime = 1000 * 60 * 60 * parseInt(muteTime);
      endMute.setHours(endMute.getHours() + parseInt(args[1]));
    } else if(muteTime.includes('d')){
      muteTime = 1000 * 60 * 60 * 24 * parseInt(muteTime);
      endMute.setDate(endMute.getDate() + parseInt(args[1]));
    } else if(muteTime.includes('w')){
      muteTime = 1000 * 60 * 60 * 24 * 7 * parseInt(muteTime);
      endMute.setDate(endMute.getDate() + parseInt(args[1]));
    } else if(muteTime.includes('mo')){
      muteTime = 1000 * 60 * 60 * 24 * 7 * 30 * parseInt(muteTime);
      endMute.setDate(endMute.getDate() + parseInt(args[1]));
    } else if(muteTime.includes('y')){
      muteTime = 1000 * 60 * 60 * 24 * 7 * 30 * 12 * parseInt(muteTime);
      endMute.setDate(endMute.getDate() + parseInt(args[1]));
    } else {
      return message.channel.send(`${muteTime} could not be formatted to a time.`);
    };
    const roles = member.roles.cache.keyArray();
    const key = `${message.guild.id}-${member.id}`;
    client.mute.ensure(key, {
      roles: roles,
      unmuteDate: endMute,
      member: member.id,
      guild: message.guild.id
    });

    const muted = message.guild.roles.cache.get(client.botsettings.get(message.guild.id, 'mutedRole')) || message.guild.roles.cache.find(x => x.name.toLowerCase().includes('muted'));

    if(!muted) message.guild.roles.create({
        data: {
          name: 'Muted',
          color: 'GRAY',
					permissions: [
							SEND_MESSAGES: false
						]
        },
      }).then(role => client.botsettings.set(message.guild.id, role.id, 'mutedRole'));

    const reason = args.slice(2).join(' ') || `${member} was muted for ${ms(muteTime, {long: true})}.`;

    async function mute() {
      member.roles.set([muted]);
      member.send(`Ỳou have been muted in ${message.guild.name} for ${ms(muteTime, {long: true})}\nReason: ${reason}`);
      message.channel.send(`${member} was muted for ${ms(muteTime, {long: true})}\nReason: ${reason}`);

      setTimeout(() => {
        member.roles.set(roles);
        member.send(`You have been unmuted in ${message.guild.name}.`);
        client.mute.delete(key);
      }, muteTime);
      client.emit('logger', 'Muted member', message.author.tag, member.user.tag, reason, ms(muteTime), 'mute', message.url, message.guild.id);
    };
    mute();
  },
};
