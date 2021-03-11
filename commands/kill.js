const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'kill',
  alias: [],
  description: 'Kill a member.',
  category: 'fun',
  permissions: ['man'],
  botpermissions: [],
  development: false,
  ea: false,
  execute(message, args, client) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase().startsWith(args[0])) || message.member;
    const mem = `${message.guild.id}-${member.id}`;
    const exe = `${message.guild.id}-${message.member.id}`;

    if (!client.kill.has(mem)) {
      client.kill.ensure(mem, {
        kills: 0,
        deaths: 0
      });
    };

    client.kill.inc(exe, 'kills');
    client.kill.inc(mem, 'deaths');

    if (member.id === message.member.id) {
      client.kill.dec(exe, 'kills');
      client.kill.dec(mem, 'deaths');
      const embed = new MessageEmbed()
        .setTitle(`${member.displayName} plays a game of sudoku`)
        .setFooter(`${member.displayName}'s deaths: ${client.kill.get(mem, 'deaths')}, ${message.member.displayName}'s kills: ${client.kill.get(exe, 'kills')}.`)

      message.channel.send(embed);
    } else {
      const embed = new MessageEmbed()
        .setTitle(`${member.displayName} was killed by ${message.member.displayName}`)
        .setFooter(`${member.displayName}'s deaths: ${client.kill.get(mem, 'deaths')}, ${message.member.displayName}'s kills: ${client.kill.get(exe, 'kills')}.`)

      message.channel.send(embed)
    };
  },
};