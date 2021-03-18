const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'joinroles',
  alias: ['autorole'],
  description: 'Settings for joinroles.',
  category: 'utilities',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please use either \`toggle\`, \`add\` or \`remove\``);
    if (args[0] === 'toggle') {
      const curr = client.joinroles.get(message.guild.id, 'enabled');
      client.joinroles.set(message.guild.id, !curr, 'enabled');
      return message.channel.send(`Autorole is now set to ${!curr}`);
    } else if (args[0] === 'add') {
      if (!args[1]) return message.channel.send(`Please send the id of the role to add`);
      const role = message.guild.roles.cache.get(args[1]);
      if (!role) return message.channel.send(`Invalid role was received`);
      if (client.joinroles.get(message.guild.id, 'roles').includes(role.id)) return message.channel.send(`That role is already an autorole!`);
      client.joinroles.push(message.guild.id, role.id, 'roles');
      return message.channel.send(`${role} was added as a autorole`)
    } else if (args[0] === 'remove') {
      if (!args[1]) return message.channel.send(`Please send the id of the role to remove`);
      const role = message.guild.roles.cache.get(args[1]);
      if (!role) return message.channel.send(`Invalid role was received`);
      if (!client.joinroles.get(message.guild.id, 'roles').includes(role.id)) return message.channel.send(`That role is not an autorole!`);
      client.joinroles.remove(message.guild.id, role.id, 'roles');
      return message.channel.send(`${role} was removed from autoroles`)
    };
  },
};