const {MessageEmbed} = require('discord.js');
const {devs, devGuilds} = require('../config.json')
module.exports = async (client, message) => {
  const key = `${message.guild.id}-${message.member.id}`;
  
  client.adventures.set(key, message.guild.id, 'guild');
  client.adventures.set(key, message.member.id, 'member');

  const xp = client.adventures.get(key, 'xp');
  const level = client.adventures.get(key, 'level');
  const baseLevel = client.adventures.get(key, 'baseLevel');

  if(level >= baseLevel * 10) return;

  const randomXp = Math.floor(Math.random() * (15-1)) + 1;

  const xpNeeded = (250 * level) * baseLevel;
  if(xp >= xpNeeded) {
    client.adventures.inc(key, 'level');
  };
};