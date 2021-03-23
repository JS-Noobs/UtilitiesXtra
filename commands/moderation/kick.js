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
    const member = await message.guild.fetchMember(args[0]);
    if(member === null) return message.channel.send(`Invalid user was given.`);
    const reason = args.join(' ').slice(1) || 'No reason was given';

    if(message.member.roleHigher(member)) return message.channel.send(`This member has a higher than or equal role to yours and can't be affected by you.`);
    if(message.member.roleHigher(member)) return message.channel.send(`This member has a higher than or equal role to myself so I can't affect them.`)
    

    try {
      await member.send(`You have been kicked from ${message.guild.name} by ${message.member.displayName}`);
      await member.kick().then(member => {
        message.channel.send(`${member} have been kicked.`);;
      });
    } catch (err) {
      await member.kick().then(member => {
        message.channel.send(`${member} have been kicked.`);;
      });
    };
  },
};