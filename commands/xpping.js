const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
	name: 'xpping',
  alias: ['xpp'],
	description: 'Toggle the bot pinging you when you level up, this setting is global.',
  category: 'usersettings',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    const cur = client.usersettings.get(message.author.id, 'xpping');
    client.usersettings.set(message.author.id, !cur, 'xpping');
    const newCur = client.usersettings.get(message.author.id, 'xpping');
    const embed = new MessageEmbed()
    if(newCur === true){
      embed.setTitle(`From now on you will be pinged when you level up.`)
      .setColor('GREEN')
    } else{
      embed.setTitle(`From now on you will no longer be pinged when you level up.`)
      .setColor('RED')
    };
    return message.channel.send(embed);
  },
};