const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const shop = require('../shop.json');

module.exports = {
  name: 'buy',
  alias: [],
  description: 'Buy items from the shop.',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const key = `${message.guild.id}-${message.author.id}`;
    let bonus = 1;
    if (client.stats.get(key, 'barter') >= 1) bonus = (client.stats.get(key, 'barter') * 10) / 100 + 1;

    let amount = parseInt(args[0]);
    let item;
    let search;

    if (!isNaN(amount)) {
      item = shop.find(x => x.name.toLowerCase() === args.splice(1).join(' ').toLowerCase());
      search = args.splice(1).join(' ');
    } else {
      item = shop.find(x => x.name.toLowerCase() === args.join(' ').toLowerCase());
      search = args.join(' ').toLowerCase();
      amount = 1;
    };

    if (!item) return message.channel.send(`The shop dont sell any item called \`${search}\`.`);
    if (item.buy === 'NFS') return message.channel.send(`This item cannot be bought`)

    const cost = parseInt(Math.round(item.buy * 2 / (bonus / 2)) * amount) || parseInt(Math.round(item.sell * 2 / (bonus / 2)) * amount);

    if (client.economy.get(key, 'total') < cost) return message.channel.send(`You can't pay for this come back when you have $${cost}.`);
    if (client.inventory.get(key, 'items').length >= client.inventory.get(key, 'max')) return message.channel.send(`You don't have enough space in your backpack, sell items or upgrade your backpack to fit more items`);

    if (client.inventory.get(key, 'items').some(x => x.name.toLowerCase() === item.name.toLowerCase())) {
      client.inventory.get(key, 'items').forEach(x => {
        if (x.name.toLowerCase() === item.name.toLowerCase()) x.amount += amount;
      });
    } else {
      client.inventory.push(key, { "name": `${item.name}`, "amount": amount }, 'items');
    };
    client.economy.math(key, '-', cost, 'wallet');
    client.economy.math(key, '-', cost, 'total');

    message.channel.send(`You bought ${amount} ${item.name} from the shop for ${cost}.`);
  },
};