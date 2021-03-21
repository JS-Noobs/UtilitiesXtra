const {MessageEmbed} = require('discord.js');
module.exports = {
  name: 'base',
  alias: ['home'],
  description: 'The heart of your adventure. A place to call home.',
  usage: '',
  category: 'adventuring',
  userPermissions: [],
  botPermissions: [],
  developer: false,
  development: true,
  execute: async (message, args, client) => {
    if(!args[0]) return message.channel.send(`Specify either \`view\``);
    const key = `${message.guild.id}-${message.member.id}`;
    if(args[0] === 'view'){
      const embed = new MessageEmbed()
      .setTitle(`${message.member.displayName}'s base.`)
      .setDescription(`Level: ${client.adventures.get(key, 'level')}`)
      .setColor(`GREEN`)

      return message.channel.send(embed)
    };
  },
};