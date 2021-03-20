const set = new Set();
const { MessageEmbed } = require('discord.js');
const fs = require('fs');
module.exports = async (client, member) => {
  const key = member.guild.id;
  if (client.botsettings.get(key, 'sendBye') === false) return;
  const messages = client.botsettings.get(key, 'goodbyeMessage');
  if (messages.length <= 0) return;
  const channel = client.botsettings.get(key, 'goodbyeChannel');
  if (!channel) return;
  const arr = [];
  messages.forEach(x => arr.push(x));
  let message = arr[Math.floor(Math.random() * arr.length)];
  message = message.split('{member}').join(member.user.tag);
  message = message.split('{server}').join(member.guild.name);
  const mc = member.guild.memberCount.toString();
  if (mc.endsWith(1)) message = message.split('{count}').join(mc + 'st');
  else if (mc.endsWith(2)) message = message.split('{count}').join(mc + 'nd');
  else if (mc.endsWith(3)) message = message.split('{count}').join(mc + 'rd');
  else message = message.split('{count}').join(mc + 'th');

  const embed = new MessageEmbed()
    .setTitle('Member left')
    .setDescription(message)
    .setColor('RED')

  const sendChan = client.channels.cache.get(channel);
  sendChan.send(embed);
};