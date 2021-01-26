const {MessageEmbed} = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
const monsters = require('../monsters.json');
const timeout = new Set();
module.exports = {
	name: 'adventure',
  alias: ['av'],
	description: 'Start an adventure',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    const key = `${message.guild.id}-${message.member.id}`;
    const stats = client.adventure.get(key);
    const curLevel = stats.level;

    function random() {
      return Math.floor(Math.random() * (100-1))+1;
    };

    if(timeout.has(key)) return message.channel.send('You are too tired to adventure rest a while and come back.');

    let val = (client.stats.get(key, 'stealth')*5);
    if(val > 100) val = 100
    const randoms = random();

    if(!args[0] || args[0].match(/next|go|continue/igm)){
      timeout.add(key);
      client.setTimeout(() => {
        timeout.delete(key)
      }, 1000 * 60 * 5-(client.stats.get(key, 'endurance') * 1000) * 25)
      const monster = monsters[Math.floor(Math.random() * monsters.length)];
      if(randoms > monster.kill+val-stats.difficulty && stats.lifes-1 > 0){
        const embed = new MessageEmbed()
        .setTitle(monster.name)
        .setDescription(`You were hurt by a ${monster.name} and lost 1 life you have ${stats.lifes-1} lifes remaining.`)
        .setColor(monster.color)
        client.adventure.dec(key, 'lifes')
        message.channel.send(embed)
      } else if(randoms > monster.kill+val-stats.difficulty && stats.lifes-1 <= 0){
        const embed = new MessageEmbed()
        .setTitle(monster.name)
        .setDescription(`While fighting a ${monster.name} you were fatally hit and got killed, all your earnings for this adventure has been transfered to your bank.`)
        .addField('XP Got', stats.xp, true)
        .addField('\u200b', '\u200b', true)
        .addField('Money got', '$'+stats.moneyreward, true)
        .addField('Level reached', stats.level, true)
        .addField('\u200b', '\u200b', true)
        .addField('Difficulty multiplier', stats.difficulty, true)
        .setColor(monster.color)

        client.economy.math(key, '+', stats.moneyreward, 'bank');
        client.economy.math(key, '+', stats.moneyreward, 'total');

        client.adventure.set(key, 3, 'lifes');
        if(stats.level > stats.highestLvl) client.adventure.set(key, stats.level, 'highestLvl');
        client.adventure.set(key, 0, 'level');
        client.adventure.set(key, 0, 'difficulty');
        client.adventure.set(key, 0, 'xp');
        client.adventure.set(key, 0, 'moneyreward');

        return message.channel.send(embed)
      } else if(randoms <= monster.kill+val-stats.difficulty){
        const items = [];
        monster.drops.forEach(x => {
          const value = random()
          if(value <= x.rarity+(client.stats.get(key, 'strength')*2)-stats.difficulty) items.push({name:x.name, amount:1});
        });
        items.forEach(x => {
          if(client.inventory.get(key, 'items').length >= client.inventory.get(key, 'max')) return;
          if(client.inventory.get(key, 'items').some(y => y.name === x.name)){
            client.inventory.get(key, 'items').forEach(y => {
              if(y.name === x.name) y.amount++
            })
          } else {
            client.inventory.push(key, x, 'items');
          }
        });
        const embed = new MessageEmbed()
        .setTitle(monster.name)
        .setDescription(`You stumble upon a ${monster.name} and kill it. You loot it and continue your adventure.`)
        if(items.length > 0) embed.addField('Items found', '\u200b'+items.map(x => x.name).join(', '))
        embed.setFooter(`Level: ${stats.level+1}`)
        embed.setColor(monster.color)

        let bonus = 1;
        if(client.stats.get(key, 'luck') >= 1) Math.round(client.stats.get(key, 'luck') * 15) / 100;

        const xp = Math.round(((Math.round(Math.random() * (250-125))+125) * bonus)*(1+(stats.difficulty/10)));
        client.economy.math(key, '+', Math.round(xp), 'xp');
        client.adventure.math(key, '+', Math.round(xp), 'xp')
        const money = Math.round(((Math.round(Math.random() * (100-50))+50) * bonus)*(1+(stats.difficulty/10)));
        client.adventure.math(key, '+', Math.round(money), 'moneyreward');
        client.adventure.inc(key, 'level');
        client.adventure.math(key, '+', 2, 'difficulty');
        client.adventure.set(key, monster.name, 'monster');
        if(stats.level > stats.highestLvl) client.adventure.set(key, stats.level, 'highestLvl')

        embed.addField('XP Reward', xp)
        .addField('Money Reward', money)

        return message.channel.send(embed);
      };
    };
  },
};