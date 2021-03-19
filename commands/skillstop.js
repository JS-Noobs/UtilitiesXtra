const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'skillstop',
  alias: ['skilltop'],
  description: 'Shows servers skill top',
  category: 'adventuring',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const total = client.stats.filter(x => x.guild === message.guild.id).array().length
    const page = parseInt(args[0]) || 1;
    const leader = client.stats.filter(x => x.guild === message.guild.id).array().sort((x, y) => {
      const xk = `${x.guild}-${x.member}`;
      const yk = `${y.guild}-${y.member}`;
      let xt = 0;
      let yt = 0;
      for (let prop in client.stats.get(xk)) {
        if (prop === 'guild' || prop === 'member') break;
        xt += client.stats.get(xk, prop);
      };
      for (let prop in client.stats.get(yk)) {
        if (prop === 'guild' || prop === 'member') break;
        yt += client.stats.get(yk, prop)
      }
      const xl = client.economy.get(xk, 'level');
      const xx = client.economy.get(xk, 'xp');
      const yl = client.economy.get(yk, 'level');
      const yx = client.economy.get(yk, 'xp');

      if (xt > yt) return -1;
      else if (xt === yt && xl > yl) return -1;
      else if (xt === yt && xl === yl && xx > yx) return -1;
      else if (xt === yt && xl === yl && xx === yx) return 0;
      else if (xt === yt && xl === yl && xx < yx) return 1;
      else if (xt === yt && xl < yl) return 1;
      else if (xt < yt) return 1;
    });

    const me = leader.find(x => x.member === message.member.id);
    const place = leader.indexOf(me) + 1;
    const leaders = leader.splice(page * 10 - 10, 10);

    let top;
    let topList = client.economy.filter(x => x.guild === message.guild.id).array()
    if (page === 1) top = 10;
    else if (page <= 5) top = 50;
    else if (page <= 10) top = 100;
    else if (page <= 50) top = 500;
    else if (page <= 100) top = 1000;
    else top = topList.length;

    async function embed() {

      const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`${message.guild.name}'s top #${top} most skilled`)
      for (let i = 0; i < leaders.length; i++) {
        let total = 0;
        let skills = [];
        const key = `${message.guild.id}-${leaders[i].member}`
        for (let prop in client.stats.get(key)) {
          if (prop === 'member') break;
          if (prop === 'guild') break;
          skills.push({ name: prop, amount: client.stats.get(key, prop) })
          total += client.stats.get(key, prop)
        }
        let user = await client.users.fetch(leaders[i].member);
        let placement = `#${page * 10 - 10 + (i + 1)}`;
        if (placement === '#1') placement = '🥇';
        if (placement === '#2') placement = '🥈';
        if (placement === '#3') placement = '🥉';
        embed.addField(`${placement} - ${user.tag} (${total}/${skills.length * 10})`, `${skills.map(x => `${x.name.substr(0, 3)}: ${x.amount}`).join(', ')}`);
      };
      embed.setFooter(`Page ${page}/${Math.ceil(total / 10)}`)
      message.channel.send(embed);
    };
    embed()
  },
};