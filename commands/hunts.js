const {MessageEmbed} = require('discord.js');
const monsters = require('../monsters.json');
const cd = new Set();

module.exports = {
	name: 'huntstats',
  alias: ['hunts'],
	description: 'Check your hunting stats',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: true,
  ea: true,
	execute(message, args, client) {
    const key = message.guild.id+'-'+message.member.id;
    const stat = client.mkills.get(key, 'monsters');
    const stats = [];
    stat.forEach(x => stats.push(x));
    const total = stats.length;
    let page = parseInt(args[0]) || 1;
    if(page > Math.ceil(total/10)) page = Math.ceil(total/10);
    const spliced = stats.splice(page*10-10,10).sort((x,y) => y.kills-x.kills);
    let totals = 0;
    let kills = 0;
    let success = (kills/totals)*100
    stat.forEach(x => {
      totals += (x.kills+x.esc);
      kills += x.kills;
      success = Math.round((kills/totals)*100)
    });

    if(total <= 0) return message.channel.send(`You have not killed any monsters yet, go hunt then check back here again.`);

    let embed = new MessageEmbed()
    .setTitle(`Hunting Stats`)
    .setDescription(spliced.map(x => `**${x.name}** - Killed: ${x.kills}, Escaped: ${x.esc}, Success: ${Math.round(x.kills/(x.kills+x.esc)*100)}%`).join('\n'))
    .setFooter(`Page ${page}/${Math.ceil(total/10)}\nAvg Success: ${success}%`)

    message.channel.send(embed)
  },
};