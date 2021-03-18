const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'globaltop',
  alias: ['gtop'],
  description: 'Shows the global leaderboard',
  category: 'boteco',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    let msg;
    const total = client.globaleco.array().length;
    const leader = client.globaleco.array().sort((x, y) => {
      if (x.prestige > y.prestige) return -1;
      else if (x.prestige === y.prestige && x.level > y.level) return -1;
      else if (x.prestige === y.prestige && x.level === y.level && x.xp > y.xp) return -1;
      else if (x.prestige === y.prestige && x.level === y.level && x.xp === y.xp && x.money > y.money) return -1;
      else if (x.prestige === y.prestige && x.level === y.level && x.xp === y.xp && x.money === y.money) return 0;
      else if (x.prestige === y.prestige && x.level === y.level && x.xp === y.xp && x.money < y.money) return 1;
      else if (x.prestige === y.prestige && x.level === y.level && x.xp < y.xp) return 1;
      else if (x.prestige === y.prestige && x.level < y.level) return 1;
      else if (x.prestige < y.prestige) return 1;
    });
    const me = leader.find(x => x.member === message.member.id);
    const place = leader.indexOf(me) + 1;

    let page = parseInt(args[0]) || 1;
    if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);
    const leaders = leader.splice(page * 10 - 10, 10);
    let top;
    let topList = client.globaleco.array()
    if (page === 1) top = 10;
    else if (page <= 5) top = 50;
    else if (page <= 10) top = 100;
    else if (page <= 50) top = 500;
    else if (page <= 100) top = 1000;

    async function embed() {
      const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`Global Leaderboard`)
      for (let i = 0; i < leaders.length; i++) {
        let user = await client.users.fetch(leaders[i].member);
        let placement = `#${page * 10 - 10 + (i + 1)}`;
        if (placement === '#1') placement = '🥇';
        if (placement === '#2') placement = '🥈';
        if (placement === '#3') placement = '🥉';
        embed.addField(`${placement} - ${user.tag}, ${leaders[i].prestige}`, `Lvl: ${leaders[i].level}, Xp: ${Math.round(leaders[i].xp)}, Money: $${leaders[i].money}`);
        embed.setFooter(`Page ${page}/${Math.ceil(total / 10)}`)
      };

      msg = await message.channel.send(embed);
    };
    embed();
  },
};