const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'balancetop',
  alias: ['baltop'],
  description: 'Shows the servers economy leaderboard.',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    let msg;
    const total = client.economy.filter(x => x.guild === message.guild.id).array().length;
    const leader = client.economy.filter(x => x.guild === message.guild.id).array().sort((x, y) => y.total - x.total);
    const me = leader.find(x => x.member === message.member.id);
    const place = leader.indexOf(me) + 1;

    let page = parseInt(args[0]) || 1;
    if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);
    const leaders = leader.sort((x, y) => y.total - x.total).splice(page * 10 - 10, 10);
    let top;
    let topList = client.economy.filter(x => x.guild === message.guild.id).array()
    if (page === 1) top = 10;
    else if (page <= 5) top = 50;
    else if (page <= 10) top = 100;
    else if (page <= 50) top = 500;
    else if (page <= 100) top = 1000;

    async function embed() {
      const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`${message.guild.name}'s balance top #${top} richest`)
      for (let i = 0; i < leaders.length; i++) {
        let user = await client.users.fetch(leaders[i].member);
        let placement = `#${page * 10 - 10 + (i + 1)}`;
        if (placement === '#1') placement = '🥇';
        if (placement === '#2') placement = '🥈';
        if (placement === '#3') placement = '🥉';
        embed.addField(`${placement} - ${user.tag}, Lvl: ${leaders[i].level}`, `Wallet: $${leaders[i].wallet}, Bank: $${leaders[i].bank}, Total: $${leaders[i].total},`);
        embed.setFooter(`Page ${page}/${Math.ceil(total / 10)}`)
      };

      msg = await message.channel.send(embed);
    };
    embed();
  },
};