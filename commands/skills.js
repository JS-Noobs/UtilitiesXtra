const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'skills',
  alias: ['skill'],
  description: 'Shows your skills',
  category: 'adventuring',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0]) || message.member;

    const key = `${message.guild.id}-${member.id}`;
    if (!args[0]) {
      if (!client.stats.has(key)) {
        client.stats.ensure(key, {
          strength: 0,
          endurance: 0,
          stealth: 0,
          barter: 0,
          luck: 0,
          guild: message.guild.id,
          member: member.id
        });
      };

      let skills = [];
      let skTot = 0;

      const full = client.emojis.cache.find(x => x.name === 'bar10');
      const empty = client.emojis.cache.find(x => x.name === 'bar0');

      for (let prop in client.stats.get(key)) {
        if (prop === 'guild') break;
        if (prop === 'member') break;
        skills.push({ name: prop, amount: [] })
        for (i = 0; i < 10; i++) {
          skills.find(x => x.name === prop).amount.push(empty)
        };
        const stat = client.stats.get(key, prop);
        skTot += parseInt(stat);
        for (x = 0; x < stat; x++) {
          skills.find(y => y.name === prop).amount[x] = full
        };
      };

      const embed = new MessageEmbed()
        .setTitle(`${member.user.tag}'s skills`)
      for (i = 0; i < skills.length; i++) {
        const amount = client.stats.get(key, skills[i].name);
        embed.addField(`${skills[i].name.replace(skills[i].name[0], skills[i].name[0].toUpperCase())} ${amount}/10`, skills[i].amount.join('\u200b'))
      };

      message.channel.send(embed);
    } else if (args[0] === 'buy') {
      const skill = client.stats.get(key, args[1])
      if (!client.stats.has(key, args[1])) return message.channel.send(args[1] + ' is not a valid skill');
      if (skill >= 10) return message.channel.send(`This skill is maxed out.`);
      const level = client.economy.get(key, 'level');
      if (level < 15) return message.channel.send(`You dont have enough levels to buy a skillpoint you need atleast 15 levels.`);
      const money = client.economy.get(key, 'total');
      if (money < 15000) return message.channel.send(`You dont have enough money to buy a skillpoint you need atleast $15000.`);

      client.economy.math(key, '-', 15000, 'total');
      let toPay = 15000;
      if (client.economy.get(key, 'wallet') < 15000) {
        client.economy.math(key, '-', client.economy.get(key, 'wallet'), 'wallet');
        toPay -= client.economy.get(key, 'wallet');
        client.economy.math(key, '-', toPay, 'bank');
        client.economy.set(key, 0, 'levelInc')
      };

      client.economy.math(key, '-', 15, 'level');

      client.stats.inc(key, args[1]);

      return message.channel.send(`You have increased your ${args[1]} skill.`);

    }
  },
};