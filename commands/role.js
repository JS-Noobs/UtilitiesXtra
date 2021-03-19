const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const set = new Set();

module.exports = {
  name: 'role',
  alias: [],
  description: 'Add, delete or get information about a role',
  category: 'utilities',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    if(!args[0]) return message.channel.send(`Please mention a role or use its id.`);
    const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[0]);
    if(!role) return message.channel.send(`Invalid role.`);
    else if(!args[1]) return message.channel.send(`Please use one of following options \`info\``);
    if(args[1] === 'info'){
      let above = message.guild.roles.cache.find(x => x.position === role.position+1) || `No role is higher than ${role.name}.`
      let below = message.guild.roles.cache.find(x => x.position === role.position-1) || `No role is lower than ${role.name}.`
      const embed = new MessageEmbed()
      .setTitle(role.name)
      .setColor(role.color)
      .addField(`Role above`, `${above.name} (${above.position})`, true)
      .addField(`Current`, `${role.name} (${role.position})`, true)
      .addField(`Role below`, `${below.name} (${below.position})`, true)
      .setDescription(`${role.permissions.has('ADMINISTRATOR') ? 'This role has admin permissions' : 'This role does not have admin permissions'}\nThere is ${role.members.size} members with this role ${role.members.cache.has(message.author.id) ? 'You are one of them' : 'You are not one of them'}`)

      return message.channel.send(embed);
    }
  },
};