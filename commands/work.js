const { MessageEmbed } = require('discord.js');
const set = new Set();
const timer = require('timer-node');

module.exports = {
  name: 'work',
  alias: [],
  description: 'Do some work and earn quick money',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
  execute(message, args, client) {
    const earn = Math.floor(Math.random() * 50) + 50;
    const key = `${message.guild.id}-${message.member.id}`;
    const time = Math.floor(Math.random() * 6) + 6;
    const works = ['janitor', 'garbageman', 'cashier', 'baker', 'gardener'];
    const work = works[Math.floor(Math.random() * works.length)];

    const fail = new MessageEmbed()
    fail.setTitle(`You couldnt find any work to do try again later`)
    fail.setColor(`ORANGE`)
    if (set.has(key)) return message.channel.send(fail);
    set.add(key);
    client.economy.math(key, '+', earn, 'wallet');
    client.economy.math(key, '+', earn, 'total');
    const embed = new MessageEmbed()
    embed.setTitle(`You worked for ${time} hours as a ${work} and earned $${earn}`)
    embed.setColor(`BLUE`)
    message.channel.send(embed);
    setTimeout(() => {
      set.delete(key);
    }, 1000 * 60 * 5);
  },
};
