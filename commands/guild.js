const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'guild',
  alias: ['server', 'serverinfo', 'info', 'guildinfo'],
  description: 'Shows information about the server',
  category: 'development',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const bots = message.guild.members.cache.filter(x => x.user.bot).size;
    const humans = parseInt(message.guild.memberCount - bots);
    const total = message.guild.memberCount;
    const name = message.guild.name;
    const icon = message.guild.iconURL();

    let stuff = [];

    if (message.guild.partnered) stuff.push(`This server is an official Discord partner`);
    if (message.guild.verified) stuff.push(`This server is verified`);

    const embed = new MessageEmbed()
      .setTitle(`${name}'s information`)
      .setAuthor(message.guild.owner.user.tag + '/' + message.guild.owner.displayName, message.guild.owner.user.displayAvatarURL())
      .addField(`Members`, humans, true)
      .addField(`Bots`, bots, true)
      .addField(`Total`, total, true)
      .setThumbnail(icon)
      .addField(`Region`, message.guild.region, true)
      .addField(`Role count`, message.guild.roles.cache.size, true)
      .setFooter(stuff.join('\n'))

    message.channel.send(embed);
  },
};