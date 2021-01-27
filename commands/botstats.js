const {MessageEmbed} = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
const monsters = require('../monsters.json');
const timeout = new Set();
const os = require('os')
module.exports = {
	name: 'botstats',
  alias: ['bstats'],
	description: 'Check bot statistics',
  category: 'bot',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    const cpuUsage = os.cpus();
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const percent = ((totalMem/freeMem) / 100).toFixed(2);
    const embed = new MessageEmbed()
    .setTitle('Bot statistics')
    .addField('CPU Usage', `${cpuUsage}%`, true)
    .addField('\u200b', '\u200b', true)
    .addField('\u200b', '\u200b', true)
    .addField('Total Memory', totalMem, true)
    .addField('Free Memory', freeMem, true)
    .addField('Memory Used', percent, true)
    
    message.channel.send(embed)
  },
};
