const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'kick',
  alias: [],
  description: 'Kicks members from the server allowing them to rejoin at any poing',
  usage: 'kick <member> (reason)',
  category: 'moderation',
  userPermissions: ['KICK_MEMBERS'],
  botPermissions: ['KICK_MEMBERS'],
  developer: false,
  development: false,
  execute: async (message, args, client) => {
    if(!args[0]) return message.channel.send(`Please use the following format \`kick <member> (reason)\``);
    const member = await message.guild.members.fetch(args[0].replace(/<@(!)?/igm, '').replace(/>/igm, '')) || message.guild.members.cache.get(args[0]);
    if(!member) return message.channel.send(`Invalid user was given.`);
    const reason = args.join(' ').slice(1) || 'No reason was given';

    if(member.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(`This member has a higher than or equal role to yours and can't be affected by you.`);
    if(member.roles.highest.position >= message.guild.me.roles.highest.position) return message.channel.send(`This member has a higher than or equal role to myself so I can't affect them.`);

    try {
      await member.send(`You have been kicked from ${message.guild.name} by ${message.member.displayName}`).catch(err => {console.error(err.message)});
      await member.kick().then(member => {
        message.channel.send(`${member} have been kicked.`);;
      }).catch(err => {console.error(err.message)});
    } catch (err) {
      await member.kick().then(member => {
        message.channel.send(`${member} have been kicked.`);;
      }).cathc(err => {console.error(err.message)});
    };
  },
};