const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const set = new Set();
const shop = require('../shop.json');
module.exports = {
  name: 'sell',
  alias: [],
  description: 'Sell items from your inventory',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  development: false,
  developer: false,
  ea: false,
  execute(message, args, client) {
    const key = `${message.guild.id}-${message.author.id}`;
    let bonus = 1;
    if (client.stats.get(key, 'barter') >= 1) bonus = (client.stats.get(key, 'barter') * 10) / 100 + 1;
    if (!args[0]) return message.channel.send(`Please specify the amount you want to sell or sell all`);
    if (args[0] === 'all') {
      if (client.inventory.get(key, 'items').length <= 0) return message.channel.send(`You don't have anything to sell`)
      const embed = new MessageEmbed()
        .setTitle('You successfully sold')
      const a = [];
      let sum = 0;
      client.inventory.get(key, 'items').forEach(x => {
        const item = shop.find(y => y.name.toLowerCase() === x.name.toLowerCase());
        if (item.sell === 'NFS') return;
        sum += Math.round((item.sell * x.amount) * bonus)
        a.push({ n: item.name, p: Math.round((item.sell * x.amount) * bonus), a: x.amount })
        client.economy.math(key, '+', Math.round((item.sell * x.amount) * bonus), 'wallet');
        client.economy.math(key, '+', Math.round((item.sell * x.amount) * bonus), 'total');
      });
      let canUp = true;
      const tries = Math.round(sum / 50);
      for (i = 0; i < tries; i++) {
        const rnd = Math.floor(Math.random() * (100 - 1)) + 1;
        if (rnd <= 1 && canUp && client.stats.get(key, 'barter' < 10)) {
          canUp = false;
          client.stats.inc(key, 'barter');
          embed.setAuthor('You leveled up your barter')
        }
      }
      client.inventory.delete(key, 'items')
      embed.setDescription(`\`\`\`${a.map(x => `${x.a} - ${x.n}: $${x.p}`).join('\n')}\`\`\``)
        .setFooter(`Total $${sum}`)
      message.channel.send(embed)
    } else {
      const amount = parseInt(args[0]) || 1;
      if (!args[1]) return message.channel.send(`Please enter the item name you want to sell`);
      const item = message.content.split(' ').slice(2).join(' ').toLowerCase();
      const items = shop

      if (!items.some(x => x.name.toLowerCase() === item)) return message.channel.send(`The shop do not buy any **\u200b${item}**.`);

      const inv = client.inventory.get(key, 'items');
      if(inv.some(x => x.amount < amount)) return message.channel.send(`You don't have enough ${item} to sell`);
      if (!inv.some(x => x.name.toLowerCase() === item || amount > x.amount)) return message.channel.send(`You do not have **${amount} ${item}** to sell`);

      const price = parseInt(amount * shop.find(x => x.name.toLowerCase() === item).sell) || 0;
      const i = shop.find(x => x.name.toLowerCase() === item);
      const embed = new MessageEmbed()

      let canUp = true;
      const tries = Math.round(price / 50);
      for (z = 0; z < tries; z++) {
        const rnd = Math.floor(Math.random() * (100 - 1)) + 1;
        if (rnd <= 1 && canUp && client.stats.get(key, 'barter') < 10) {
          canUp = false;
          client.stats.inc(key, 'barter');
          embed.setAuthor('You leveled up your barter')
        }
      }

      inv.forEach(x => {
        if (item.sell === 'NFS') return;
        if (x.name.toLowerCase() === item) {
          if (amount < x.amount) {
            client.inventory.remove(key, x, 'items');
            client.inventory.push(key, { "name": x.name, "amount": parseInt(x.amount - amount) }, 'items');
          } else if (x.amount === amount) {
            client.inventory.remove(key, x, 'items');
          };
        };
      });
      client.economy.math(key, '+', Math.round(price * bonus), 'wallet');
      client.economy.math(key, '+', Math.round(price * bonus), 'total');
      embed.setTitle(`Item(s) sold!`)
      embed.setDescription(`You successfully sold **${amount} ${item}** to the shop for $${Math.round(price * bonus)}!`)

      message.channel.send(embed)
    };
  },
};
