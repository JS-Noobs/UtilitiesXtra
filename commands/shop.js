const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const shop = require('../shop.json')

module.exports = {
  name: 'shop',
  alias: [],
  description: 'Views the shop',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    let page = parseInt(args[0]) || 1;
    const arr2 = shop;
    const total = shop.length;

    if (page > Math.ceil(total / 6)) page = Math.ceil(total / 6)

    const a = []
    arr2.forEach(x => a.push(x));
    const arr = a.sort((x, y) => x.name).sort((a, b) => {
      let fa = a.name.toLowerCase();
      let fb = b.name.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    }).splice(page * 6 - 6, 6)

    let bonus = 1;
    if (client.stats.get(message.guild.id + '-' + message.member.id, 'barter') >= 1) bonus = (client.stats.get(message.guild.id + '-' + message.member.id, 'barter') * 10) / 100 + 1;

    const embed = new MessageEmbed()
      .setTitle('Shop')
    arr.forEach(x => {
      let buy;
      if (x.buy === '-') buy = parseInt(Math.round(x.sell * 2 / (bonus / 2)));
      else if (x.buy === 'NFS') buy = ('Not buyable');
      else buy = parseInt(x.buy * 2 / (bonus / 2))
      let sell = parseInt(Math.round(x.sell * bonus)) || 'Not sellable';
      embed.addField(x.name, `Buy for: ${buy}\nSell for: ${sell}\n${x.desc}`, true)
    })
    embed.setFooter(`Page ${page}/${Math.ceil(total / 6)}`);

    message.channel.send(embed)
  },
};