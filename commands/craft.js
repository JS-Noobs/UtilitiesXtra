const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');
const recipes = require('../recipes.json');

module.exports = {
	name: 'craft',
  alias: ['create'],
	description: 'Craft items for upgrades',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    if(!args[0]) return message.channel.send(`Please type what you want to craft\nTo see recipes use the recipes command`)
    const key = `${message.guild.id}-${message.member.id}`;
    const item = message.content.split(' ').slice(1).join(' ').toLowerCase();
    let it = recipes.find(x => x.result.toLowerCase() === item);
    if(!it) return message.channel.send('That recipe does not exist');
    const name = it.result.replace(it.result[0], it.result[0].toUpperCase());
    let curItems2 = 0;
    client.inventory.get(key, 'items').forEach(x => {
      curItems2 += x.amount;
    });
    it.requirements.forEach(x => {
      curItems2 -= x.amount;
    });
    const max = client.inventory.get(key, 'max');
    if(curItems2 >= max) return message.channel.send(`You don't have space in your backpack for this`);
    const inv = client.inventory.get(key, 'items');
    for(let i=0; i<it.requirements.length;i++){
      let r = it.requirements[i];
      let itemA = inv.find(x => x.name.toLowerCase() === r.item.toLowerCase());
      if(!itemA) return message.channel.send(`You don't have any ${r.item} to craft with.`);
      if(itemA.amount < r.amount) return message.channel.send(`You dont have the required *${r.amount} ${r.item}* to craft with`);
    };
    for(let i=0; i<it.requirements.length;i++){
      let r = it.requirements[i];
      let itemA = inv.find(x => x.name.toLowerCase() === r.item.toLowerCase());
      if(itemA.amount === r.amount){
        client.inventory.remove(key, (v) => v.name.toLowerCase() === r.item.toLowerCase(), 'items');
      } else if(itemA.amount > r.amount){
        client.inventory.get(key, 'items').forEach(x => {
          if(x.name.toLowerCase() === r.item.toLowerCase()) x.amount -= r.amount;
        });
      };
    };

    const chance = client.stats.get(key, 'intelligence') * 5;
    let extra = 1;
    if(Math.floor(Math.random() * (100 - 1) + 1) <= chance) extra++


    if(client.inventory.get(key, 'items').some(x => x.name.toLowerCase() === item)){
      client.inventory.get(key, 'items').forEach(x => {
        if(x.name.toLowerCase() === item) x.amount += extra;
      });
    } else {
      const val = {"name": `${name}`,"amount": extra}
      client.inventory.push(key, val, 'items');
    };

    const remaining = `${client.inventory.get(key, 'items').length}/${client.inventory.get(key, 'max')} slots filled.`;
    const embed = new MessageEmbed()
    .setTitle('Item crafted')
    .setDescription(`You have crafted a ${it.result}`)
    if(Math.floor(Math.random() * (100 - 1) + 1) <= 5) embed.setFooter(`You leveled up your intelligence!\m${remaining}`)
    else embed.setFooter(remaining)

    message.channel.send(embed);
  },
};