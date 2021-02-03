const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
	name: 'gstats',
  alias: ['ginfo','gstatisstics'],
	description: 'Shows your global stats',
  category: 'boteco',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    const member = client.users.cache.find(x => x.username === args[0]) || client.users.cache.find(x => x.tag === args[0]) || client.users.cache.get(args[0]) || message.author;
    const key = member.id;
    if(!client.globaleco.has(key)) {
      client.globaleco.ensure(key, {
        money: 0,
        xp: 0,
        level: 0,
        member: key,
        uCoins: 0,
        xpboosts: [],
        balboosts: [],
        permxpboost: 1,
        permbalboost: 1,
        tempxpboost: 0,
        tempbalboost: 0,
        prestige: 0,
        requiredxp: 750
      });
    };
    const prestige = client.globaleco.get(key, 'prestige');
    let level = client.globaleco.get(key, 'level');
    if(level === 10 * (prestige + 1)) level = 'MAX'
    const xp = Math.round(client.globaleco.get(key, 'xp'));
    const xpNext = Math.round(client.globaleco.get(key, 'requiredxp'));
    const percent = Math.round((xp/xpNext) * 100).toString();
    let arr = percent.split('')
    if(arr.includes('.')) arr = arr.splice(0, arr.indexOf('.'));
    const bar = [];
    const money = client.globaleco.get(key, 'money');
    const ucoins = client.globaleco.get(key, 'uCoins');
    const xpboost = client.globaleco.get(key, 'permxpboost') + client.globaleco.get(key, 'tempxpboost');
    const balboost = client.globaleco.get(key, 'permbalboost') + client.globaleco.get(key, 'tempbalboost');
    const lvl = Math.round(client.globaleco.get(key, 'level'));
    const lvlNext = Math.round((client.globaleco.get(key, 'prestige')+1)*10)
    const percent2 = (Math.round((lvl/lvlNext) * 100)+Math.round((xp/xpNext) * 10)).toString();
    let arr2 = percent2.split('');
    if(arr2.includes('.')) arr2 = arr2.splice(0, arr2.indexOf('.'));
    const bar2 = [];

    if(arr2.length === 3) {
      for(let i=0;i<10;i++){
        bar2.push(client.emojis.cache.find(x => x.name === 'bar10'));
      };
    } else if(arr2.length === 2) {
      for(let i=0;i<arr2[0]; i++) {
        bar2.push(client.emojis.cache.find(x => x.name === `bar10`))
      };
      for(let i=0;i<10;i++){
        if(i == arr2[1]) bar2.push(client.emojis.cache.find(x => x.name === `bar${i}`))
      };
    } else if(arr2.length === 1) {
      for(let i=0;i<10;i++){
        if(i == arr2[0]) bar2.push(client.emojis.cache.find(x => x.name === `bar${i}`))
      }
    };
    for(let i = bar2.length; i<10; i++){
      bar2.push(client.emojis.cache.find(x => x.name === `bar0`))
    };

    if(arr.length === 3) {
      for(let i=0;i<10;i++){
        bar.push(client.emojis.cache.find(x => x.name === `bar10`))
      };
    } else if(arr.length === 2) {
      for(let i=0;i<arr[0]; i++) {
        bar.push(client.emojis.cache.find(x => x.name === `bar10`))
      };
      for(let i=0;i<10;i++){
        if(i == arr[1]) bar.push(client.emojis.cache.find(x => x.name === `bar${i}`))
      }
    } else if(arr.length === 1) {
      for(let i=0;i<10;i++){
        if(i == arr[0]) bar.push(client.emojis.cache.find(x => x.name === `bar${i}`))
      }
    };
    for(let i = bar.length; i<10; i++){
      bar.push(client.emojis.cache.find(x => x.name === `bar0`))
    };

    let percent3 = percent2;
    if(arr[1]) percent3 += '.'+arr[1];
    else percent3 += '.'+arr[0];

    const embed = new MessageEmbed()
    .setTitle(member.tag+'\'s global stats')
    .setDescription(`Prestige level: ${prestige}\nLevel: ${level}\nMoney: ${money}\nUCoins: ${ucoins}\nActive XP Boost: ${xpboost}\nActive Money Boost: ${balboost}`)
    .addField(`XP (${xp}/${xpNext} - ${percent}%)`, bar.join('\u200b'))
    .addField(`Next prestige (lvl ${lvl}/${lvlNext} - ${percent3}%)`, bar2.join('\u200b'))

    message.channel.send(embed)
  },
};