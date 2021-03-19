const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const monsters = require('../monsters.json');
const items = require('../shop.json');
const recipes = require('../recipes.json');

module.exports = {
  name: 'wiki',
  alias: ['docs'],
  description: 'Wiki/documentation of the bots rpg',
  category: 'misc',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const searchs = ['monster', 'item']
    const key = `${message.guild.id}-${message.author.id}`;
    if (!args[0]) {
      return message.channel.send(`Please use one of following search phrases \n\`${searchs.join('\n')}\``);
    } else if (args[0].match(/monster(s)?/igm)) {
      if (args[1] === 'list') {
        let page = parseInt(args[2]) || 1;
        const total = monsters.length;
        if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);
        let arr = [];
        monsters.forEach(x => arr.push(x))
        arr = arr.splice(page * 9 - 9, 9);
        const embed = new MessageEmbed()
          .setTitle('Monsters')
        arr.forEach(x => {
          embed.addField(`${x.name}`, x.desc.split(' ').splice(0, 12).join(' ') + '...', true)
        })
        embed.setFooter(`Showing monster ${page * 9 - 8}-${page * 9}/${total}\nPage ${page}/${Math.ceil(total / 10)}`)
        message.channel.send(embed)
      } else {
        const item = args.slice(1).join(' ').toLowerCase()
        if (item.length <= 0) return message.channel.send(`Please enter the monster to search you can use the \`list\` option to view all monsters`)
        const search = monsters.find(x => x.name.toLowerCase().includes(item));
        if (!search) return message.channel.send('There is no monster that goes by the name ' + item)
        const embed = new MessageEmbed()
          .setTitle(search.name)
          .addField('Chance to kill', (search.kill + (client.stats.get(message.guild.id + '-' + message.member.id, 'stealth') * 5) + '%'))
          .addField('Drops', search.drops.map(x => `${x.name}: ${(x.rarity + (client.stats.get(key, 'strength') * 2))}%`).join('\n'))
        if (search.user) embed.addField('User submitted', search.user)
          .setDescription(search.desc)
          .setColor(search.color)
          .setFooter(`Viewing monster ${monsters.indexOf(search) + 1}/${monsters.length}`)
        message.channel.send(embed)
      };
    } else if (args[0].match(/item(s)?/igm)) {
      if (args[1] === 'list') {
        let page = parseInt(args[2]) || 1;
        const total = items.length;
        if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);
        let arr = [];
        items.forEach(x => arr.push(x))
        arr = arr.splice(page * 9 - 9, 9);
        const embed = new MessageEmbed()
          .setTitle('Items')
        arr.forEach(x => {
          embed.addField(`${x.name}`, x.desc.split(' ').splice(0, 12).join(' ') + '...', true)
        })
        embed.setFooter(`Showing item ${page * 9 - 8}-${page * 9}/${total}\nPage ${page}/${Math.ceil(total / 10)}`)
        message.channel.send(embed)
      } else {
        const item = args.slice(1).join(' ').toLowerCase()
        if (item.length <= 0) return message.channel.send(`Please enter the item to search you can use the \`list\` option to view all items`)
        const search = items.find(x => x.name.toLowerCase().includes(item));
        if (!search) return message.channel.send('There is no item that goes by the name ' + item)
        const arr = [];
        monsters.forEach(x => {
          let name;
          let rarity;
          if (x.drops.some(y => y.name.toLowerCase() === search.name.toLowerCase())) {
            name = x.name;
            rarity = x.drops.find(y => y.name.toLowerCase() === search.name.toLowerCase()).rarity;
            arr.push({ "name": name, "rarity": rarity })
          };
        });
        let bonus = 1;
        if (client.stats.get(key, 'barter') >= 1) bonus = (client.stats.get(key, 'barter') * 10) / 100 + 1;
        let buy = parseInt(Math.round(search.buy * 2 / (bonus / 2))) || parseInt(Math.round(search.sell * 2 / (bonus / 2)));
        if (buy === 'NFS') buy = 'Not for sale'
        let sell = parseInt(Math.round(search.sell * bonus)) || 'Not sellable';
        if (!isNaN(buy)) buys = '$' + buy;
        if (!isNaN(sell)) sells = '$' + sell;

        const embed = new MessageEmbed()
          .setTitle(search.name)
          .setDescription(search.desc)
          .addField('Buy price', buy, true)
          .addField('Sell price', sell, true)
          .addField('Dropped from', '\u200b' + arr.map(x => `${x.name.split('*').join('')}: ${x.rarity + client.stats.get(key, 'strength') * 2}%`).join('\n'))
          .setColor('PURPLE')
          .setFooter(`Viewing item ${items.indexOf(search) + 1}/${items.length}`)
        message.channel.send(embed)
      }
    } else {
      return message.channel.send(`${args[0]} is not a valid option: \n\`${searchs.join('\n')}\``);
    }
  },
};