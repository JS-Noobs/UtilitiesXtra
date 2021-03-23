const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'lunarkick',
  alias: [],
  description: 'Kicks members from the server allowing them to rejoin at any poing',
  usage: 'lunarkick <member> (reason)',
  category: 'moderation',
  userPermissions: ['KICK_MEMBERS'],
  botPermissions: ['KICK_MEMBERS'],
  developer: true,
  development: true,
  execute: async (message, args, client) => {
    const botname = message.guild.me
    if(!args[0]) return message.channel.send(`Please use the following format \`kick <member> (reason)\``);
    const member = await message.guild.fetchMember(args[0]);
    if(member === null) return message.channel.send(`Invalid user was given.`);
    const reason = args.join(' ').slice(1) || 'No reason was given';
    
    if(member.id === '365153135704145920' , '365153135704145920' ) return message.channel.send(`Fuck no`)
    if(message.member.roleHigher(member)) return message.channel.send(`This member has a higher than or equal role to yours and can't be affected by you.`);
    if(message.member.roleHigher(member)) return message.channel.send(`This member has a higher than or equal role to myself so I can't affect them.`)
    if(member.id === '780858079096995840') return message.channel.send(`Test`)

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