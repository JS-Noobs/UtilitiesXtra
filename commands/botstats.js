const { MessageEmbed } = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
const monsters = require('../monsters.json');
const timeout = new Set();
const os = require('os');
const si = require('systeminformation');
module.exports = {
  name: 'botstats',
  alias: ['bstats'],
  description: 'Check bot statistics',
  category: 'information',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    const cpus = os.cpus();
    let cpuUsage
    for (var i = 0, len = cpus.length; i < len; i++) {
      console.log("CPU %s:", i);
      var cpu = cpus[i], total = 0;

      for (var type in cpu.times) {
        total += cpu.times[type];
      };

      for (type in cpu.times) {
        cpuUsage = Math.round(100 * cpu.times[type] / total);
      };
    };
    const totalMem = os.totalmem();
    const freeMem = os.freemem();
    const percent = ((freeMem / totalMem) * 100).toFixed(2);
    const cpType = await si.cpu()
    console.log(cpType)
    const embed = new MessageEmbed()
      .setTitle('Bot statistics')
      .setDescription(`CPU: ${cpType.manufacturer} ${cpType.brand} ${cpType.speed} GHz ${cpType.cores} cores, ${cpType.processors} processors`)
      .addField('CPU Usage', `${cpuUsage}%`, true)
      .addField('\u200b', '\u200b', true)
      .addField('\u200b', '\u200b', true)
      .addField('Total Memory', Math.round(totalMem / 1000000) + 'MB', true)
      .addField('Free Memory', Math.round(freeMem / 1000000) + 'MB', true)
      .addField('Memory Used', (100 - percent).toFixed(2) + '%', true)

    message.channel.send(embed)
  },
};
