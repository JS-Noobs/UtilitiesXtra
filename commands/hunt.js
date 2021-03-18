const { MessageEmbed } = require('discord.js');
const monsters = require('../monsters.json');
const cd = new Set();

module.exports = {
  name: 'hunt',
  alias: [],
  description: 'Go on a hunt',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    let incStr = false;
    let incEnd = false;
    let incStl = false;
    let up;

    const key = `${message.guild.id}-${message.member.id}`
    if (cd.has(key)) return message.channel.send(`You are too tired to hunt wait a few minutes`);

    const monster = monsters[Math.floor(Math.random() * monsters.length)];

    cd.add(key)
    setTimeout(() => {
      cd.delete(key);
    }, 1000 * 60 * (15 - (client.stats.get(key, 'endurance'))))

    if (Math.floor(Math.random() * (100 - 1)) + 1 > monster.kill + (client.stats.get(key, 'stealth') * 5)) {
      const embed = new MessageEmbed()
        .setTitle(`You went out for a hunt`)
        .setDescription(`You found a ${monster.name} you tried to kill it but it escaped before you could land a killing blow`)
        .setColor(monster.color)
      if (Math.floor(Math.random() * (100 - 1)) + 1 <= 5 && client.stats.get(key, 'stealth') < 10 && !incStr && !incEnd) incStl = true;
      if (incStl) {
        client.stats.inc(key, 'stealth');
        embed.setAuthor('You leveled up your stealth!')
      }
      if (client.mkills.get(key, 'monsters').some(x => x.name.toLowerCase() === monster.name.toLowerCase())) {
        client.mkills.get(key, 'monsters').forEach(x => {
          if (x.name.toLowerCase() === monster.name.toLowerCase()) x.esc++
        })
      } else {
        client.mkills.push(key, { name: monster.name, kills: 0, esc: 1 }, 'monsters')
      };
      return message.channel.send(embed)
    };

    let resources = [];
    monster.drops.forEach(drop => {
      const rand = Math.floor(Math.random() * (100 - 1)) + 1;
      if (rand <= drop.rarity + (client.stats.get(key, 'strength') * 2)) resources.push(drop.name)
    });

    let curItems = 0;
    client.inventory.get(key, 'items').forEach(x => {
      curItems += x.amount;
    });
    const max = client.inventory.get(key, 'max');

    for (let i = 0; i < resources.length; i++) {
      let curItems2 = 0;
      let amount = 1;
      if (Math.floor(Math.random() * (100 - 1)) + 1 <= client.stats.get(key, 'intelligence') * 5) amount++;
      if (Math.floor(Math.random() * (100 - 1)) + 1 <= 25) amount++
      client.inventory.get(key, 'items').forEach(x => {
        curItems2 += x.amount;
      });
      if (curItems2 >= max) break;
      if (client.inventory.get(key, 'items').some(x => x.name === resources[i])) {
        client.inventory.get(key, 'items').forEach(x => {
          if (x.name === resources[i]) x.amount += amount
        })
      } else {
        if (curItems2 >= max) break;
        const val = { "name": `${resources[i]}`, "amount": amount }
        client.inventory.push(key, val, 'items');
      };
    };

    let newCur = 0;
    client.inventory.get(key, 'items').forEach(x => newCur += x.amount);

    const embed = new MessageEmbed()
      .setTitle(`You went out for a hunt`)
    if (curItems >= client.inventory.get(key, 'max')) embed.setDescription(`When out hunting you find a ${monster.name} you kill it but dont have enough space in your backpack to take anything with you`)
    else if (resources.length < 1) embed.setDescription(`When out hunting you find a ${monster.name} you kill it but you found nothing on its corpse`)
    else if (resources.length === 1) embed.setDescription(`When out hunting you find a ${monster.name} you kill it and take\n\`\`\`1 ${resources[0]}\`\`\`\n`)
    else if (resources.length > 1) embed.setDescription(`When out hunting you find a ${monster.name} you kill it and take\n\`\`\`${resources.map(x => `1 ${x}`).join(',\n')}\`\`\`\n`)
    embed.setFooter(`${newCur}/${max} slots filled.`)
      .setColor(monster.color)

    if (Math.floor(Math.random() * (100 - 1)) + 1 <= 5 && !incEnd && !incStl && client.stats.get(key, 'strength') < 10) incStr = true;
    if (incStr) {
      client.stats.inc(key, 'strength');
      embed.setAuthor('You leveled up your strength!')
    }
    if (Math.floor(Math.random() * (100 - 1)) + 1 <= 2 && !incStr && !incStl && client.stats.get(key, 'endurance') < 10) incEnd = true;
    if (incEnd) {
      client.stats.inc(key, 'endurance');
      embed.setAuthor('You leveled up your endurance!')
    }

    if (client.mkills.get(key, 'monsters').some(x => x.name.toLowerCase() === monster.name.toLowerCase())) {
      client.mkills.get(key, 'monsters').forEach(x => {
        if (x.name.toLowerCase() === monster.name.toLowerCase()) x.kills++
      })
    } else {
      client.mkills.push(key, { name: monster.name, kills: 1, esc: 0 }, 'monsters')
    };

    message.channel.send(embed)
  },
};