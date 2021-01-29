const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'messagetop',
  alias: ['mtop', 'msgtop', 'topmessage', 'topmsg'],
	description: 'Shows the servers message leaderboard.',
  category: 'misc',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    if(args[0] === 'total') {
      const total = client.messages.filter(x => x.guild === message.guild.id).array().length;
      const leader = client.messages.filter(x => x.guild === message.guild.id).array().sort((x, y) => y.total - x.total);
      const me = leader.find(x => x.member === message.member.id);
      const place = leader.indexOf(me) + 1;
      
      let page = parseInt(args[0]) || 1;
      if(page > Math.ceil(total/10)) page = Math.ceil(total/10);
      const leaders = leader.sort((x, y) => y.total - x.total).splice(page*10-10, 10);
      let top;
      let topList = client.messages.filter(x => x.guild === message.guild.id).array()
      if(page === 1) top = 10;
      else if(page <= 5) top = 50;
      else if(page <= 10) top = 100;
      else if(page <= 50) top = 500;
      else if(page <= 100) top = 1000;
      
      const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`${message.guild.name}'s top #${top} most active`)
        for(let i = 0; i < leaders.length; i++){
          let user = await client.users.fetch(leaders[i].member);
          let placement = `#${page*10-10+(i+1)}`;
          if(placement === '#1') placement = '🥇';
          if(placement === '#2') placement = '🥈';
          if(placement === '#3') placement = '🥉';
          embed.addField(`${placement} - ${user.tag}`, `Total: ${leaders[i].total}, Today: ${leaders[i].dailyMessages}`);
        };
        embed.setFooter(`Page ${page}/${Math.ceil(total/10)}`)
        message.channel.send(embed);
     } else if(args[0] === 'daily') {
      const total = client.messages.filter(x => x.guild === message.guild.id).array().length;
      const leader = client.messages.filter(x => x.guild === message.guild.id).array().sort((x, y) => y.dailyMessages - x.dailyMessages);
      const me = leader.find(x => x.member === message.member.id);
      const place = leader.indexOf(me) + 1;
      
      let page = parseInt(args[0]) || 1;
      if(page > Math.ceil(total/10)) page = Math.ceil(total/10);
      const leaders = leader.sort((x, y) => y.total - x.total).splice(page*10-10, 10);
      let top;
      let topList = client.messages.filter(x => x.guild === message.guild.id).array()
      if(page === 1) top = 10;
      else if(page <= 5) top = 50;
      else if(page <= 10) top = 100;
      else if(page <= 50) top = 500;
      else if(page <= 100) top = 1000;
      
      const embed = new MessageEmbed()
        .setAuthor(`${message.member.displayName} placement ${place}/${total}`, message.author.displayAvatarURL())
        .setTitle(`${message.guild.name}'s top #${top} most active today`)
        for(let i = 0; i < leaders.length; i++){
          let user = await client.users.fetch(leaders[i].member);
          let placement = `#${page*10-10+(i+1)}`;
          if(placement === '#1') placement = '🥇';
          if(placement === '#2') placement = '🥈';
          if(placement === '#3') placement = '🥉';
          embed.addField(`${placement} - ${user.tag}`, `Today: ${leaders[i].dailyMessages}, Total: ${leaders[i].total}`);
        };
        embed.setFooter(`Page ${page}/${Math.ceil(total/10)}`)
        message.channel.send(embed);
     } else {
        return message.channel.send(`Invalid option \`total\`/\`daily\``)
     };
  },
};
