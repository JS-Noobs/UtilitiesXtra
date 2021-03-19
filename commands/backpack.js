const { MessageEmbed } = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
module.exports = {
  name: 'backpack',
  alias: ['inventory', 'inv', 'bp'],
  description: 'Shows your backpack or upgrade it',
  category: 'adventuring',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    let page = parseInt(args[0]) || 1;
    const total = client.inventory.get(message.guild.id + '-' + message.member.id, 'items').length + 1;

    if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);

    if (!args[0] || !isNaN(parseInt(args[0]))) {
      const member = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[1])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[1]) || message.member;
      const key = `${message.guild.id}-${member.id}`;
      const level = client.inventory.get(key, 'level');
      const items = client.inventory.get(key, 'items');

      let arr = [];
      items.forEach(x => arr.push(x));
      arr = arr.splice(page * 10 - 10, 10);

      let ic = 0;
      let sum = 0;
      let bonus = 1;
      if (client.stats.get(key, 'barter') >= 1) bonus = (client.stats.get(key, 'barter') * 10) / 100 + 1;
      arr.forEach(x => {
        if (!shop.some(y => y.name.toLowerCase() === x.name.toLowerCase())) return;
        if (!shop.find(y => y.name.toLowerCase() === x.name.toLowerCase()).sell) return;
        sum += Math.round((shop.find(y => y.name.toLowerCase() === x.name.toLowerCase()).sell * x.amount) * bonus)
      })

      arr.forEach(x => ic += x.amount)
      const embed = new MessageEmbed()
        .setTitle(`${member.user.tag}'s lvl ${level} backpack`)
      if (arr.length <= 0) embed.setDescription('The backpack is empty')
      else embed.setDescription(`\`\`\`${arr.map(x => {
        let sell = 'NFS'
        if (shop.find(y => y.name.toLowerCase() === x.name.toLowerCase()) && shop.find(y => y.name.toLowerCase() === x.name.toLowerCase()).sell) { sell = '$' + Math.round((shop.find(y => y.name.toLowerCase() === x.name.toLowerCase()).sell * x.amount) * bonus) }
        return `${x.amount} ${x.name} - ${sell}`
      }).join(', \n')}\`\`\`Total value: $${sum}`)
      embed.setFooter(`${ic}/${client.inventory.get(key, 'max')} slots filled\nPage ${page}/${Math.ceil(total / 10)}`)
      message.channel.send(embed);
    } else if (args[0] === 'upgrade') {
      const key = `${message.guild.id}-${message.member.id}`;
      const level = client.inventory.get(key, 'level');
      const backpacks = upgrades.find(x => x.name === 'backpack');
      const toUpg = backpacks.levels.find(x => x.lvl === level + 1);
      const cost = toUpg.price;
      const bal = client.economy.get(key, 'total');
      const inv = client.inventory.get(key, 'items');
      if (bal < cost) return message.channel.send(`You don't have enough money to pay the worker for the upgrade.\nYou need atleast $${cost} to pay him.`);
      const requirements = toUpg.items;
      for (let i = 0; i < requirements.length; i++) {
        let r = requirements[i];
        let itemA = inv.find(x => x.name.toLowerCase() === r.name.toLowerCase());
        if (!itemA) return message.channel.send(`You don't have any ${r.name} to upgrade with`);
        if (itemA.amount < r.amount) return message.channel.send(`You don't have the required *${r.amount} ${r.name}*`)
      };
      for (let i = 0; i < requirements.length; i++) {
        let r = requirements[i];
        let itemA = inv.find(x => x.name.toLowerCase() === r.name.toLowerCase());
        if (itemA.amount === r.amount) {
          client.inventory.remove(key, (v) => v.name.toLowerCase() === r.name.toLowerCase(), 'items');
          client.economy.math(key, '-', cost, 'wallet');
          client.economy.math(key, '-', cost, 'total');
        } else if (itemA.amount > r.amount) {
          client.inventory.get(key, 'items').forEach(x => {
            if (x.name.toLowerCase() === r.name.toLowerCase()) x.amount -= r.amount;
          });
          client.economy.math(key, '-', cost, 'wallet');
          client.economy.math(key, '-', cost, 'total');
        };
      };
      client.inventory.inc(key, 'level');
      client.inventory.set(key, toUpg.storage, 'max');

      const embed = new MessageEmbed()
        .setTitle(`Backpack upgraded to level ${toUpg.lvl}`)
        .setDescription(`Your new backpack have a total of ${toUpg.storage} storage slots`)
        .setFooter(`${client.inventory.get(key, 'items').length}/${client.inventory.get(key, 'max')} slots filled`)

      message.channel.send(embed);
    };
  },
};