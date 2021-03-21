const set = new Set();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const luck = new Set();
const servers = require('../eas.json');
module.exports = async (client, message) => {
  if (message.channel.type === 'dm') return;

  client.emit('permissions', message);

  // Welcome channel ensuring
  const wChan = message.guild.channels.cache.find(x => x.name.toLowerCase().includes('welcome')) || '';
  client.botsettings.set(message.guild.id, wChan, 'welcomeChannel');

  const bChan = message.guild.channels.cache.find(x => x.name.toLowerCase().includes('goodbye')) || '';

  if (message.author.bot) return;

  if (client.votechannels.get(message.guild.id, 'channels').includes(message.channel.id)) {
    const embed = new MessageEmbed()
      .setTitle(message.member.displayName)
      .setDescription(message.content)
      .setFooter(message.member.id)
      .setColor('ORANGE')
    message.delete()
    const msg = await message.channel.send(embed);
    await msg.react(client.votechannels.get(message.guild.id, 'yes'));
    await msg.react(client.votechannels.get(message.guild.id, 'no'));
  };

  client.globaleco.ensure(message.member.id);
  const xpboost = client.globaleco.get(message.member.id, 'permxpboost') + client.globaleco.get(message.member.id, 'tempxpboost');
  const balboost = client.globaleco.get(message.member.id, 'permbalboost') + client.globaleco.get(message.member.id, 'tempbalboost');
  const gIncXp = Math.floor(Math.random() * ((50 - 25) * xpboost) + 25);
  const gIncBal = Math.floor(Math.random() * ((50 - 25) * balboost) + 25);
  const incUCoin = Math.floor(Math.random() * (10000 - 1) + 1);

  if (client.globaleco.get(message.member.id, 'level') < 10 * (client.globaleco.get(message.member.id, 'prestige') + 1)) client.globaleco.math(message.member.id, '+', gIncXp, 'xp');
  client.globaleco.math(message.member.id, '+', gIncBal, 'money');
  if (incUCoin <= 5) client.globaleco.inc(message.member.id, 'uCoins');

  while (client.globaleco.get(message.member.id, 'xp') >= client.globaleco.get(message.member.id, 'requiredxp')) {
    let xpLeft = client.globaleco.get(message.member.id, 'xp') - client.globaleco.get(message.member.id, 'requiredxp');
    let rXp = client.globaleco.get(message.member.id, 'requiredxp') * 1.75;
    client.globaleco.set(message.member.id, 0, 'xp');
    client.globaleco.math(message.member.id, '+', xpLeft, 'xp');
    client.globaleco.inc(message.member.id, 'level');
    client.globaleco.set(message.member.id, rXp, 'requiredxp');
    client.globaleco.inc(message.member.id, 'uCoins')
  };

  const key = `${message.guild.id}-${message.member.id}`;
  client.messages.ensure(key);
  // Updates the client.messages enmap
  client.messages.update(key, { member: message.member.id, guild: message.guild.id });
  const date = new Date();
  const date2 = new Date();
  date2.setHours(0);
  date2.setMinutes(0);
  date2.setSeconds(0);
  date2.setMilliseconds(0);
  const nextDay = new Date(date2.setDate(date2.getDate() + 1));
  const msDate = Date.parse(nextDay);
  client.messages.inc(key, 'total');
  client.messages.inc(key, 'dailyMessages')
  if (client.messages.get(key, 'nextDay') === 0) client.messages.set(key, msDate, 'nextDay')
  client.messages.forEach((v, k, e) => {
    if (client.messages.get(k, 'nextDay') <= Date.parse(date)) {
      client.messages.set(k, msDate, 'nextDay');
      client.messages.set(k, 0, 'dailyMessages');
    };
  });

  client.adventure.ensure(key);
  // Updates the client.adventure enmap
  client.adventure.update(key, { member: message.member.id, guild: message.guild.id });

  client.stats.ensure(key);
  // Updates the client.stats enmap
  client.stats.update(key, { member: message.member.id, guild: message.guild.id });
  let bonus = 1;
  if (client.stats.get(key, 'luck') >= 1) (client.stats.get(key, 'luck') * 15) / 100 + 1;

  const cash = Math.floor((Math.floor(Math.random() * 15) + 20) * bonus);
  const xp = Math.floor(cash * 5);

  client.economy.ensure(key);
  // Updates the client.economy enmap
  client.economy.update(key, { member: message.member.id, guild: message.guild.id });
  if (!set.has(key)) {
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
  if (cXp >= nLevel) {
    const channel = client.channels.cache.get(client.botsettings.get(message.guild.id, 'xpChannel')) || message.channel;
    if (client.botsettings.get(message.guild.id, 'xpMessage') === true) {
      const embed = new MessageEmbed()
        .setTitle(`🎉${message.author.tag} level up!🎉`)
        .setDescription(`You have leveled up to lvl ${cLevel + 1}\nYou have gained $${cash * (cLevel + 1)} as a reward`)
        .setThumbnail(message.author.displayAvatarURL())
      if (client.usersettings.get(message.author.id, 'xpping') === true) channel.send(`${message.member} leveled up!`, { embed: embed });
      else channel.send(`${message.member.displayName} leveled up!`, { embed: embed });
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

  if (!message.content.startsWith(prefix)) return;

  const args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
  const command = args.shift();

  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(command));

  if (!cmd) return;

  if (!message.guild.me.permissions.has('EMBED_LINKS') && client.warning.get(message.guild.id, 'sent') === false) {
    message.channel.send('Hey! It seems I don\'t have permissions to send embeds, most of my commands are based on them if you can give me the `Embed Links` that would be lovely!')
    client.warning.set(message.guild.id, true, 'sent');
    client.setTimeout(() => {
      client.warning.set(message.guild.id, false, 'sent')
    }, 1000 * 60 * 60 * 60 * 24)
  }


  if (client.botsettings.get(message.guild.id, 'disabledCommands').includes(cmd.name)) return;
  if (client.botsettings.get(message.guild.id, 'disabledCommandCategories').includes(cmd.category)) return;
  if (client.botsettings.get(message.guild.id, 'disabledChannels').includes(message.channel)) return;
  if (client.botsettings.get(message.guild.id, 'disabledCategories').includes(message.channel.parentID)) return;
  if (client.botsettings.get(message.guild.id, 'disabledUsers').includes(message.member.id)) return;

  if (cmd.developer && !['232466273479426049', '365153135704145920', '327254568239104000'].includes(message.author.id)) return;

  if (!message.member.permissions.has(cmd.permissions)) return message.channel.send(`You don't have permissions to execute this command.\n\`\`\`${cmd.permissions.join('\n')}\`\`\``);

  if (!message.guild.me.permissions.has(cmd.botpermissions)) return message.channel.send(`I don't have permissions to execute this command.\n\`\`\`${cmd.permissions.join('\n')}\`\`\``);

  if (['economy', 'rpg'].includes(cmd.category)) {
    const rdn = Math.floor(Math.random() * (100 - 1) + 1)
    if (!luck.has(message.author.id)) {
      luck.add(message.author.id);
      setTimeout(() => {
        luck.delete(message.author.id);
      }, 1000 * 60 * 10)
      if (rdn <= 1) {
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
