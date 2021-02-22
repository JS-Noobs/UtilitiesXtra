const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'reload',
  alias: [],
  description: 'reload',
  category: 'development',
  permissions: [],
  botpermissions: [],
  development: true,
  ea: false,
  developer: true,
  execute(message, args, client) {
    if (!args.length) return message.channel.send(`Mention the command to reload`);
    const commandName = args[0].toLowerCase();
    const command = message.client.commands.get(commandName) || message.client.commands.find(cmd => cmd.aliases && cmd.aliases.includes(commandName));

    if (!command) return message.channel.send(`There is no command with name or alias \`${commandName}\``);
    delete require.cache[require.resolve(`./${command.name}.js`)];

    try {
      const newCommand = require(`./${command.name}.js`);
      message.client.commands.set(newCommand.name, newCommand);
      const embed = new MessageEmbed()
        .setTitle(`The command ${command.name} was successfully reloaded`)
        .setColor(`BLUE`)
      message.channel.send(embed);
    } catch (error) {
      console.error(error);
      const embed = new MessageEmbed()
        .setTitle(`ERROR`)
        .setDescription(error.message)
        .setColor(`ORANGE`)
      message.channel.send(embed);
    };
  },
};
