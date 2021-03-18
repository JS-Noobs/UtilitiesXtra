const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'partner',
  alias: ['partnership'],
  description: 'Main command for bot partnership',
  category: 'bot',
  permissions: ['manage_guild'],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    if(!args[0]) return message.channel.send(new MessageEmbed().setTitle('Please use one of following options.').addField('Apply', 'Apply for partnership with the bot', true).addField('\u200b', '\u200b', true).addField('Info', 'Check current information about your pending application', true).addField('Requirements', 'Show requirements to apply for partnership', true).addField('\u200b', '\u200b', true).addField('Perks', 'View the perks that comes with a partnership', true))
    if(args[0] === `requiredments`) {
      const members = 100, botAge = 7 * 24 * 60 * 60 * 1000;
      const membersNeed = message.guild.memberCount >= members ? '✅' : members - message.guild.memberCount + ' more members needed';
      const botJoined = Date.parse(message.guild.joinedAt);
      const daysNeeded = botJoined >= botAge ? '✅' : ms(botAge - botJoined)
      const embed = new MessageEmbed()
      setTitle('Partnership requirements')
      .addField(`${members} or more members`, membersNeed, true)
      .addField(`Used bot for ${ms(botAge)}`, daysNeeded, true)
      .setFooter('If you meet both of those requirements feel free to apply with the "apply" option')

      return message.channel.send(embed)
    }
  },
};