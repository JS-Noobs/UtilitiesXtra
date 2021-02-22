const { MessageEmbed } = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
module.exports = {
  name: 'adventuretop',
  alias: ['avtop'],
  description: 'Shows the top adventurers',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
  execute: async (message, args, client) => {
    const adventures = client.adventure.filter(x => x.guild === message.guild.id).array();
    const adventurers = [];
    adventures.forEach(x => adventurers.push(x))
    const myPlace = adventurers.indexOf(client.adventure.get(`${message.guild.id}-${message.member.id}`)) + 1;
    let page = parseInt(args[0]) || 1;
    const total = adventures.length;
    if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);
    const top10 = adventurers.sort((x, y) => y.highestLvl - x.highestLvl).splice(page * 10 - 10, 10);

    const embed = new MessageEmbed()
      .setTitle(`Highest adventure levels`)
      .setFooter(`Page ${page}/${Math.ceil(total / 10)}`)
    for (let i = 0; i < top10.length; i++) {
      let user = await client.users.fetch(top10[i].member);
      let placement = `#${page * 10 - 10 + (i + 1)}`;
      if (placement === '#1') placement = '🥇';
      if (placement === '#2') placement = '🥈';
      if (placement === '#3') placement = '🥉';
      embed.addField(`${placement} - ${user.tag}`, `Level: ${top10[i].highestLvl}`);
    };

    message.channel.send(embed)
  },
};