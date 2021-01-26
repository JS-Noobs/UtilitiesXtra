const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'xptop',
  alias: [],
	description: 'Shows the servers xp leaderboard.',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    const total = client.economy.filter(x => x.guild === message.guild.id).array().length;
    if(!args[0] || parseInt(args[0]) === 0 || parseInt(args[0]) === 1){
      const leader = client.economy.filter(x => x.guild === message.guild.id).array().sort((x, y) => { if(x.level > y.level) return -1;
      else if(x.level === y.level && x.xp > y.xp) return -1;
      else if(x.level === y.level && x.xp === y.xp) return 0;
      else if(x.level === y.level && x.xp < y.xp) return 1;
      else if(x.level < y.level) return 1;
      })
      const me = leader.find(x => x.member === message.member.id);
      const place = leader.indexOf(me) + 1;
      const leaders = leader.splice(0, 10);

      async function embed(){

        const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`${message.guild.name}'s top #10 highest leveled`)
        for(let i = 0; i < leaders.length; i++){
          let user = await client.users.fetch(leaders[i].member);
          let placement = `#${i+1}`;
          if(placement === '#1') placement = '🥇';
          if(placement === '#2') placement = '🥈';
          if(placement === '#3') placement = '🥉';
          embed.addField(`${placement} - ${user.tag}`, `Lvl: ${leaders[i].level}, xp: ${leaders[i].xp}`);
          embed.setFooter(`Page 1/${Math.ceil(total/10)}`)
        };

        message.channel.send(embed);
      };
      embed();
    } else if(!isNaN(parseInt(args[0])) && parseInt(args[0]) !== 0 && parseInt(args[0]) !== 1){
      let page = parseInt(args[0]);
      if(page > Math.ceil(total/10)) page = Math.ceil(total/10);
      const leader = client.economy.filter(x => x.guild === message.guild.id).array().sort((x, y) => { if(x.level > y.level) return -1;
      else if(x.level === y.level && x.xp > y.xp) return -1;
      else if(x.level === y.level && x.xp === y.xp) return 0;
      else if(x.level === y.level && x.xp < y.xp) return 1;
      else if(x.level < y.level) return 1;
      });
      const me = leader.find(x => x.member === message.member.id);
      const place = leader.indexOf(me) + 1;
      const leaders = leader.splice(page*10-10, 10);
      let top;
      let topList = client.economy.filter(x => x.guild === message.guild.id).array()
      if(page === 1) top = 10;
      else if(page <= 5) top = 50;
      else if(page <= 10) top = 100;
      else if(page <= 50) top = 500;
      else if(page <= 100) top = 1000;

      async function embed(){

        const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`${message.guild.name}'s balance top #${top} richest`)
        for(let i = 0; i < leaders.length; i++){
          let user = await client.users.fetch(leaders[i].member);
          let placement = `#${page*10-10+(i+1)}`;
          if(placement === '#1') placement = '🥇';
          if(placement === '#2') placement = '🥈';
          if(placement === '#3') placement = '🥉';
          embed.addField(`${placement} - ${user.tag}`, `Lvl: ${leaders[i].level}, xp: ${leaders[i].xp}`);
          embed.setFooter(`Page ${page}/${Math.ceil(total/10)}`)
        };

        message.channel.send(embed);
      };
      embed();
    };
  },
};