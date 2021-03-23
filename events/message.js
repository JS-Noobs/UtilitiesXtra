const {MessageEmbed} = require('discord.js');
const {devs, devGuilds} = require('../config.json')
module.exports = async (client, message) => {
  if(message.channel.type === 'dm' || message.author.bot) return;

  const prefix = client.settings.get(message.guild.id, 'prefix');

  if(!message.content.startsWith(prefix)) return;

  const args = message.content.toLowerCase().slice(prefix.length).split(/ +/);
  const command = args.shift();

  const cmd = client.commands.get(command) || client.commands.find(cmd => cmd.alias && cmd.alias.includes(command));
  if(cmd.developer && !devs.includes(message.author.id)) return;
  if(cmd.development && !devGuilds.includes(message.guild.id)) return;
  if(cmd.userPermissions && !message.member.permissions.has(cmd.userPermissions)) return message.channel.send(`You don't have permissions to run this command.`);
  if(cmd.botPermissions && !message.guild.me.permissions.has(cmd.botPermissions)) return message.channel.send(`I don't have permissions to run this command.`);

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