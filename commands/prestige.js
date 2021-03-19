const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const sett = new Set();

module.exports = {
  name: 'prestige',
  alias: [],
  description: 'Prestige to next level',
  category: 'global',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const price = 20000;
    const level = 10 * (client.globaleco.get(message.member.id, 'prestige') + 1);
    const embed = new MessageEmbed()

    if (client.globaleco.get(message.member.id, 'level') < level) {
      embed.setTitle(`You arent high enough level to prestige you need to be atleast lvl ${level} to prestige`)
        .setColor('RED')
      return message.channel.send(embed);
    };
    if (client.globaleco.get(message.member.id, 'money') < price) {
      e.setTitle(`You don't have enough money, you need ${Math.round(client.globaleco.get(message.member.id, 'money') - price)}`)
        .setColor('RED')
      return message.channel.send(embed);
    };
    if (!sett.has(message.member.id)) {
      sett.add(message.member.id);
      setTimeout(() => {
        sett.remove(message.member.id)
      }, 20000)
      return message.channel.send(`Are you sure you want to prestige you will loose all money & xp but you keep your boosts and ucoins. To confirm please use the command again.`);
    }
    if (sett.has(message.member.id)) {
      client.globaleco.inc(message.member.id, 'prestige');
      client.globaleco.set(message.member.id, 0, 'money');
      client.globaleco.set(message.member.id, 0, 'xp');
      client.globaleco.set(message.member.id, 0, 'level');
      client.globaleco.set(message.member.id, 750, 'requiredxp');

      return message.channel.send(`You have prestiged to the next level!`)
    };
  },
};