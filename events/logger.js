const set = new Set();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
const ms = require('pretty-ms')
module.exports = async (client, event, executor, member, reason, time, type, link, guild) => {
  if (client.botsettings.get(guild, 'sendLogs') === false) return;
  const embed = new MessageEmbed()
  if (type === 'ban') {
    embed.setTitle('Member banned')
      .setDescription(`${member} has been banned by ${executor} for following reason:\n${reason}`)
      .addField('Executed by', executor, true)
      .addField('Involved member', member, true)
      .addField('Go to message', `[Click Me!](${link} "Click me to go to message")`)
  } else if (type === 'tempban') {
    embed.setTitle('Member temporary banned')
      .setDescription(`${member} has been temporarily banned by ${executor} for ${time}, for following reason:\n${reason}`)
      .addField('Executed by', executor, true)
      .addField('Involved member', member, true)
      .addField('Time', time, true)
      .addField('Go to message', `[Click Me!](${link} "Click me to go to message")`)
  } else if (type === 'mute') {
    embed.setTitle('Member muted')
      .setDescription(`${member} has been muted by ${executor} for ${time}, for following reason:\n${reason}`)
      .addField('Executed by', executor, true)
      .addField('Involved member', member, true)
      .addField('Time', time, true)
      .addField('Go to message', `[Click Me!](${link} "Click me to go to message")`)
  } else if (type === 'kick') {
    embed.setTitle('Member kicked')
      .setDescription(`${member} has been kicked by ${executor} for following reason:\n${reason}`)
      .addField('Executed by', executor, true)
      .addField('Involved member', member, true)
      .addField('Go to message', `[Click Me!](${link} "Click me to go to message")`)
  } else if (type === 'softban') {
    embed.setTitle('Member banned')
      .setDescription(`${member} has been softbanned by ${executor} for following reason:\n${reason}`)
      .addField('Executed by', executor, true)
      .addField('Involved member', member, true)
      .addField('Go to message', `[Click Me!](${link} "Click me to go to message")`)
  };

  async function hook() {
    const channel = client.guilds.cache.get(guild).channels.cache.get(client.botsettings.get(guild, 'logChannel'));
    const hooks = await channel.fetchWebhooks();
    let webhook;
    if (hooks.some(x => x.name === client.user.username)) webhook = hooks.find(x => x.name === client.user.username);
    else webhook = await channel.createWebhook(client.user.username, { avatar: client.user.displayAvatarURL() });

    webhook.send(embed);
  };
  hook();
};
