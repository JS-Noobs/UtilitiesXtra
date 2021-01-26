const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
	name: 'reload',
  alias: [],
	description: 'reload',
  category: 'usersettings',
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
      message.channel.send(`Command ${command.name} was reloaded`);
    } catch (error) {
	    console.error(error);
	    message.channel.send(`\`${error.message}\``);
    };
  },
};
