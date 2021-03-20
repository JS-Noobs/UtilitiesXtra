const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'permissionroles',
  alias: ['permroles', 'proles'],
  description: 'Main command for bot partnership',
  category: 'misc',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  developer: false,
  execute: async (message, args, client) => {
    const mods = client.permissions.get(message.guild.id, 'moderatorRoles'), admins = client.permissions.get(message.guild.id, 'adminRoles');
    if(!args[0]) return message.channel.send(`Please use either \`add\`, \`remove\` or \`view\``);
    if(args[0] === view){
      const embed = new MessageEmbed()
      .setTitle(`Permission roles`)
      .setColor('BLUE')
      .addField('Moderator roles', mods.length >= 1 ? mods.join('\n') : 'There is no moderator roles set', true)
      .addField('Admin roles', admins.length >= 1 ? admins.join('\n') : 'There is no admin roles set', true)
    } else if(args[0] === 'add'){
      if(!args[1]) return message.channel.send(`Please select either \`moderator\` or \`admin\` option to specify what the role should be.`);
      if(!['moderator', 'admin'].includes(args[1])) return message.channel.send(`Please select either \`moderator\` or \`admin\` option to specify what the role should be.`);
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
      if(!role) return message.channel.send(`Please either mention the role or use it's ID`);
      if(args[1] === 'moderator'){
        client.permissions.push(message.guild.id, role.id, 'moderatorRoles');
        return message.channel.send(`${role.name} has been added to the list of moderator roles`);
      } else if(args[1] === 'admin') {
        client.permissions.push(message.guild.id, role.id, 'adminRoles');
        return message.channel.send(`${role.name} has been added to the list of admin roles`);
      }
    } else if(args[0] === 'remove'){
      if(!args[1]) return message.channel.send(`Please select either \`moderator\` or \`admin\` option to specify what the role should be.`);
      if(!['moderator', 'admin'].includes(args[1])) return message.channel.send(`Please select either \`moderator\` or \`admin\` option to specify what the role should be.`);
      const role = message.mentions.roles.first() || message.guild.roles.cache.get(args[2]);
      if(!role) return message.channel.send(`Please either mention the role or use it's ID`);
      if(args[1] === 'moderator'){
        client.permissions.push(message.guild.id, role.id, 'moderatorRoles');
        return message.channel.send(`${role.name} has been removed from the list of moderator roles`);
      } else if(args[1] === 'admin') {
        client.permissions.push(message.guild.id, role.id, 'adminRoles');
        return message.channel.send(`${role.name} has been removed from the list of admin roles`);
      };
    };
  },
};