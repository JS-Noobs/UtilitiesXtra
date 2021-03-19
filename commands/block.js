const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'block',
  alias: [],
  description: 'Block',
  category: 'developer',
  permissions: [],
  botpermissions: [],
  developer: true,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please enter an ID.`)
    const id = args[0];
    if (client.blocks.get(client.user.id, 'users').includes(id)) {
      client.blocks.remove(client.user.id, id, 'users');
      message.channel.send('User block revoked.');
    } else {
      client.blocks.push(client.user.id, id, 'users');
      message.channel.send('User blocked.');
    };
  },
};