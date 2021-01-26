const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'stats',
  alias: ['econ', 'economy', 'balance', 'bal', 'xp', 'experience'],
	description: 'Shows your economy statistics.',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0]) || message.member;

    const key = `${message.guild.id}-${member.id}`;
    const wallet = client.economy.get(key, 'wallet');
    const bank = client.economy.get(key, 'bank');
    const total = client.economy.get(key, 'total');
    const xp = client.economy.get(key, 'xp');
    const level = client.economy.get(key, 'level');
    const add = client.economy.get(key, 'levelInc');
    const xpNeeded = ((level * 500) + add) - xp;

    const leader = client.economy.filter(x => x.guild === message.guild.id).array().sort((x, y) => { if(x.level > y.level) return -1;
      else if(x.level === y.level && x.xp > y.xp) return -1;
      else if(x.level === y.level && x.xp === y.xp) return 0;
      else if(x.level === y.level && x.xp < y.xp) return 1;
      else if(x.level < y.level) return 1;
      });
    const me = leader.find(x => x.member === member.id);
    const xpplace = leader.indexOf(me) + 1;
    const eleader = client.economy.filter(x => x.guild === message.guild.id).array().sort((x, y) => y.total - x.total);
    const eme = eleader.find(x => x.member === member.id);
    const ecoplace = eleader.indexOf(eme) + 1;

    const stotal = client.stats.filter(x => x.guild === message.guild.id).array().length
    const sleader = client.stats.filter(x => x.guild === message.guild.id).array().sort((x,y) => {
      const xk = `${x.guild}-${x.member}`;
      const yk = `${y.guild}-${y.member}`;
      const xt = parseInt(x.strength + x.endurance + x.stealth);
      const yt = parseInt(y.strength + y.endurance + y.stealth);
      const xl = client.economy.get(xk, 'level');
      const xx = client.economy.get(xk, 'xp');
      const yl = client.economy.get(yk, 'level');
      const yx = client.economy.get(yk, 'xp');

      if(xt > yt) return -1;
      else if(xt === yt && xl > yl) return -1;
      else if(xt === yt && xl === yl && xx > yx) return -1;
      else if(xt === yt && xl === yl && xx === yx) return 0;
      else if(xt === yt && xl === yl && xx < yx) return 1;
      else if(xt === yt && xl < yl) return 1;
      else if(xt < yt) return 1;
    });

    const sme = sleader.find(x => x.member === member.id);
    const splace = sleader.indexOf(sme) + 1;

    const embed = new MessageEmbed()
    .setTitle(`${member.user.tag}'s stats`)
    .addField('Wallet', '$'+wallet, true)
    .addField('Bank', '$'+bank, true)
    .addField('Total', '$'+total, true)
    .addField('Experience', xp, true)
    .addField('Level', level, true)
    .addField('Exp required', xpNeeded, true)
    .setFooter(`Economy placement: ${ecoplace}/${eleader.length}\nExp placement: ${xpplace}/${leader.length}\nSkill placement: ${splace}/${stotal}\nAverage: ${Math.round((ecoplace+xpplace+splace)/3)}/${Math.round((eleader.length+leader.length+stotal)/3)}`)

    message.channel.send(embed);
  },
};