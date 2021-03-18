const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'suggestion',
  alias: ['suggest'],
  description: 'Suggest something to be added to the bot',
  category: 'bot',
  permissions: [],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please send a suggestion with the command.`)
    if (client.blocks.get(client.user.id, 'users').includes(message.author.id)) return;
    const suggestion = args.join(' ');

    const embed = new MessageEmbed()
      .setAuthor(message.author.tag, message.author.displayAvatarURL())
      .setDescription(suggestion)

    client.channels.cache.get('788129555675217930').send(embed);
    message.channel.send(`Your suggestion has been added it can be seen <#788129555675217930> in the support server.`);

  },
};