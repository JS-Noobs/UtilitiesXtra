const set = new Set();
const {MessageEmbed} = require('discord.js');
const fs = require('fs');
const luck = new Set();
const servers = require('../eas.json');
module.exports = async (client, message) => {
  if(message.channel.type === 'dm') return;
  
  client.guildsettings.ensure(message.guild.id, {
    prefix: '!'
  });

  const wChan = message.guild.channels.cache.find(x => x.name.toLowerCase().includes('welcome')) || '';
  const bChan = message.guild.channels.cache.find(x => x.name.toLowerCase().includes('goodbye')) || '';

  client.botsettings.ensure(message.guild.id, {
    sendLogs: true,
    logChannel: '',
    ignoreRolesLog: [],
    ignoreChannelsLog: [],
    ignoreUsersLog: [],
    sendWelcome: true,
    welcomeChannel: wChan.id,
    welcomeMessage: ['Welcome {member} to {server}! You are the {count} member to join!'],
    sendBye: true,
    goodbyeChannel: '',
    goodbyeMessage: ['{member} has left us all alone, there are now only {count} members left.'],
    xpMessage: true,
    xpChannel: '',
    disabledChannels: [],
    disabledCategories: [],
    disabledUsers: [],
    disabledCommands: [],
    disabledCommandCategories: [],
    mutedRole: '',
    autoRoles: [],
    verification: false,
    verificationRoles: [] 
  });

  client.votechannels.ensure(message.guild.id, {
    channels: [],
    yes: '👍',
    no: '👎'
  });

  if(client.votechannels.get(message.guild.id, 'channels').includes(message.channel.id)){
    await message.react(client.votechannels.get(message.guild.id, 'yes'));
    await message.react(client.votechannels.get(message.guild.id, 'no'));
  };

  if(message.author.bot) return;

  client.globaleco.ensure(message.member.id, {
    money: 0,
    xp: 0,
    level: 0,
    member: message.member.id,
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

  const xpboost = client.globaleco.get(message.member.id, 'permxpboost') + client.globaleco.get(message.member.id, 'tempxpboost');
  const balboost = client.globaleco.get(message.member.id, 'permbalboost') + client.globaleco.get(message.member.id, 'tempbalboost');
  const gIncXp = Math.floor(Math.random() * ((50 - 25) * xpboost) + 25);
  const gIncBal = Math.floor(Math.random() * ((50 - 25) * balboost) + 25);
  const incUCoin = Math.floor(Math.random() * (10000 - 1) + 1);

  if(client.globaleco.get(message.member.id, 'level') < 10 * (client.globaleco.get(message.member.id, 'prestige') + 1)) client.globaleco.math(message.member.id, '+', gIncXp, 'xp');
  client.globaleco.math(message.member.id, '+', gIncBal, 'money');
  if(incUCoin <= 5) client.globaleco.inc(message.member.id, 'uCoins');

  while(client.globaleco.get(message.member.id, 'xp') >= client.globaleco.get(message.member.id, 'requiredxp')){
    let xpLeft = client.globaleco.get(message.member.id, 'xp') - client.globaleco.get(message.member.id, 'requiredxp');
    let rXp = client.globaleco.get(message.member.id, 'requiredxp') * 1.75;
    client.globaleco.set(message.member.id, 0, 'xp');
    client.globaleco.math(message.member.id, '+', xpLeft, 'xp'); 
    client.globaleco.inc(message.member.id, 'level');
    client.globaleco.set(message.member.id, rXp, 'requiredxp');
    client.globaleco.inc(message.member.id, 'uCoins')
  };

  client.usersettings.ensure(message.author.id, {
    xpping: false
  });

  const key = `${message.guild.id}-${message.member.id}`;
	const date = new Date();
	const date2 = new Date();
	date2.setHours(0);
	date2.setMinutes(0);
	date2.setSeconds(0);
	date2.setMilliseconds(0);
	const nextDay = new Date(date2.setDate(date2.getDate() + 1));
	const msDate = Date.parse(nextDay);
	client.messages.ensure(key, {
		total: 0,
		nextDay: 0,
		dailyMessages: 0,
		member: message.member.id,
		guild: message.guild.id
	});
	client.messages.inc(key, 'total');
	client.messages.inc(key, 'dailyMessages')
	if(client.messages.get(key, 'nextDay') === 0) client.messages.set(key, msDate, 'nextDay')
	client.messages.forEach((v,k,e) => {
		if(client.messages.get(k, 'nextDay') <= Date.parse(date)) {
			client.messages.set(k, msDate, 'nextDay');
			client.messages.set(k, 0, 'dailyMessages');
		};
	});
  client.miner.ensure(key, {
    miner: 1,
    totalMiner: 1,
    pickaxe: 0,
    totalPickaxe: 0,
    mine: "",
    ore: "",
    xp: 0,
    totalXp: 0,
    trolley: [],
    maxTrolley: 5,
    mineCoins: 0,
    skips: 0,
    skipLevel: 0,
    oresMined: 0,
    minedOres: []
  });
  client.adventure.ensure(key, {
    monster: "",
    level: 0,
    xp: 0,
    moneyreward: 0,
    difficulty: 0,
    highestLvl: 0,
    member: message.member.id,
    guild: message.guild.id,
    lifes: 3
  });
  client.jobs.ensure(key, {
    job: "",
    rank: "",
    pay: 0,
    nxtPay: 0
  });
  client.mkills.ensure(key, {
    monsters: []
  });
  client.kill.ensure(key, {
    kills: 0,
    deaths: 0
  });
  client.inventory.ensure(key, {
    level: 1,
    max: 10,
    items: []
  });
  client.stats.ensure(key, {
    strength: 0,
    endurance: 0,
    stealth: 0,
    barter: 0,
    luck: 0,
    intelligence: 0,
    mining: 0,
    guild: message.guild.id,
    member: message.member.id
  });
  client.blocks.ensure(client.user.id, {
    users: []
  });
  
  client.economy.ensure(key, {
    wallet: 0,
    bank: 0,
    total: 0,
    xp: 0,
    level: 1,
    levelInc: 0,
    member: message.member.id,
    guild: message.guild.id
  });

  let bonus = 1;
  if(client.stats.get(key, 'luck') >= 1) (client.stats.get(key, 'luck') * 15) / 100 + 1;

  const cash = Math.floor((Math.floor(Math.random() * 15) + 20) * bonus);
  const xp = Math.floor(cash * 5);
  
  if(!set.has(key)){
    client.economy.math(key, '+', cash, 'wallet');
    client.economy.math(key, '+', xp, 'xp');

    set.add(key)
    setTimeout(() => set.delete(key), 10000);
  };
  const total = client.economy.get(key, 'wallet') + client.economy.get(key, 'bank');
  client.economy.set(key, total, 'total');

  const cLevel = client.economy.get(key, 'level');
  const lIncrease = client.economy.get(key, 'levelInc');
  const nLevel = (cLevel * 500) + lIncrease;
  const cXp = client.economy.get(key, 'xp');
  if(cXp >= nLevel) {
    const channel = client.channels.cache.get(client.botsettings.get(message.guild.id, 'xpChannel')) || message.channel;
    if(client.botsettings.get(message.guild.id, 'xpMessage') === true) {
      const embed = new MessageEmbed()
      .setTitle(`🎉${message.author.tag} level up!🎉`)
      .setDescription(`You have leveled up to lvl ${cLevel+1}\nYou have gained $${cash * (cLevel + 1)} as a reward`)
      .setThumbnail(message.author.displayAvatarURL())
      if(client.usersettings.get(message.author.id, 'xpping') === true) channel.send(`${message.member} leveled up!`, {embed: embed});
      else channel.send(`${message.member.displayName} leveled up!`, {embed: embed});
    };
    client.economy.set(key, 0, 'xp');
    client.economy.math(key, '+', 250, 'levelInc');
    client.economy.inc(key, 'level');
    const bCash = Math.floor(cash * (cLevel + 1));
    client.economy.math(key, '+', bCash, 'wallet');
    client.economy.math(key, '+', bCash, 'total');
  };

  client.economy.filter(x => x.guild === message.guild.id).filter(x => message.guild.members.cache.has(x.user)).forEach(x => x.delete(`${message.guild.id}-${x.user}`));

  
  const prefixMention = new RegExp(`^<@!?${client.user.id}> `);
  const prefix = message.content.match(prefixMention) ? message.content.match(prefixMention)[0] : client.guildsettings.get(message.guild.id, 'prefix');

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
	const command = args.shift();

  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(command));

  if(!cmd) return;

  client.warning.ensure(message.guild.id, {
    sent: false
  });

  if(!message.guild.me.permissions.has('EMBED_LINKS') && client.warning.get(message.guild.id, 'sent') === false) {
    message.channel.send('Hey! It seems I don\'t have permissions to send embeds, most of my commands are based on them if you can give me the `Embed Links` that would be lovely!')
    client.warning.set(message.guild.id, true, 'sent');
    client.setTimeout(() => {
      client.warning.set(message.guild.id, false, 'sent')
    }, 1000 * 60 * 60 * 60 * 24)
  }
 

  if(client.botsettings.get(message.guild.id, 'disabledCommands').includes(cmd.name)) return;
  if(client.botsettings.get(message.guild.id, 'disabledCommandCategories').includes(cmd.category)) return;
  if(client.botsettings.get(message.guild.id, 'disabledChannels').includes(message.channel)) return;
  if(client.botsettings.get(message.guild.id, 'disabledCategories').includes(message.channel.parentID)) return;
  if(client.botsettings.get(message.guild.id, 'disabledUsers').includes(message.member.id)) return;

  if(cmd.development && !servers.includes(message.guild.id)) return;
  if(cmd.ea && !servers.includes(message.guild.id)) return;
  if(cmd.developer && !['232466273479426049', '365153135704145920', '327254568239104000'].includes(message.author.id)) return;

  if(!message.member.permissions.has(cmd.permissions)) return message.channel.send(`You don't have permissions to execute this command.\n\`\`\`${cmd.permissions.join('\n')}\`\`\``);

  if(!message.guild.me.permissions.has(cmd.botpermissions)) return message.channel.send(`I don't have permissions to execute this command.\n\`\`\`${cmd.permissions.join('\n')}\`\`\``);

  if(['economy','rpg'].includes(cmd.category)){
    const rdn = Math.floor(Math.random() * (100 - 1) + 1)
    if(!luck.has(message.author.id)){
      luck.add(message.author.id);
      setTimeout(() => {
        luck.delete(message.author.id);
      }, 1000 * 60 * 10)
      if(rdn <= 1) {
        client.stats.inc(key, 'luck');
        message.channel.send(`You leveled up luck!`);
      };
    };
  };

  try {
	  cmd.execute(message, args, client);
  } catch (error) {
	  console.error(error);
    const embed = new MessageEmbed()
    .setTitle('ERROR')
    .setDescription(error)
    .setColor('RED')
    client.channels.cache.get('783463934573281281').send(embed).catch(err => {
      console.log(err)
    });
  };
};
