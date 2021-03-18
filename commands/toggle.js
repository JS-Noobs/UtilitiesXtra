const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'toggle',
  alias: [],
  description: 'Toggle between disabling & enabling command/user/channel/category/cmdCategory',
  category: 'botsettings',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    const key = message.guild.id;
    if (!args[0]) return message.channel.send(`Please input one of the options to see options fefer to "help toggle"`)
    if (args[0] === 'command') {
      if (!args[1]) return message.channel.send('Please input the command to toggle.')
      const cmd = client.commands.get(args[1]) || client.commands.find(x => x.alias && x.alias.includes(args[1]));
      if (!cmd) return message.channel.send(`No command could be found.`);
      if (cmd.name === 'toggle') return message.channel.send(`You can't disable this command.`);
      if (!client.botsettings.get(key, 'disabledCommands').includes(cmd.name)) {
        client.botsettings.push(key, cmd.name, 'disabledCommands');
        message.channel.send(`${cmd.name} will now not work.`);
      } else {
        client.botsettings.remove(key, cmd.name, 'disabledCommands');
        message.channel.send(`${cmd.name} will now work again.`);
      };
    } else if (args[0] === 'user') {
      const user = message.mentions.members.first() || message.guild.members.cache.get(args[1]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[1])) || message.guild.members.cache.find(x => x.user.tag === args[1]);
      if (!user) return message.channel.send(`No user was found.`);
      if (user.id === message.author.id) return message.channel.send(`You can't disable yourself.`);
      if (user.id === message.guild.ownerID) return message.channel.send(`You can't disable the server owner.`)
      if (user.roles.highest.position >= message.member.roles.highest.position) return message.channel.send(`You can't disable someone with a higher role than yourself.`);
      if (!client.botsettings.get(key, 'disabledUsers').includes(user.id)) {
        client.botsettings.push(key, user.id, 'disabledUsers');
        message.channel.send(`${user} will now not be able to run commands.`);
      } else {
        client.botsettings.remove(key, user.id, 'disabledUsers');
        message.channel.send(`${user} can now run commands again.`);
      };
    } else if (args[0] === 'channel') {
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(x => x.name.toLowerCase().includes(args[1])) || message.channel;
      if (!channel) return message.channel.send(`No channel was found.`);
      if (channel.type === 'voice') return message.channel.send(`You can't disable commands in a voice channel.`);
      if (channel.type === 'category') return message.channel.send(`You can't disable categories with this command please use the "category" option`);
      if (!client.botsettings.get(key, 'disabledChannels').includes(channel.id)) {
        client.botsettings.push(key, channel.id, 'disabledChannels');
        message.channel.send(`Commands will not run inside ${channel} anymore.`);
      } else {
        client.botsettings.remove(key, channel.id, 'disabledChannels');
        message.channel.send(`Commands can now be run inside ${channel} again.`);
      };
    } else if (args[0] === 'category') {
      const category = message.guild.channels.cache.get(args[0]) || message.guild.channels.cache.find(x => x.name.toLowerCase().includes(args[1]));
      if (!category) return message.channel.send(`No valid category channel was found.`);
      if (channel.type !== 'category') return message.channel.send(`That channel is not a category channel.`);
      if (!client.botsettings.get(key, 'disabledCategories').includes(category.id)) {
        client.botsettings.push(key, category.id, 'disabledCategories');
        message.channel.send(`The ${category.name} categories channels will now be blocked from running commmands.`);
      } else {
        client.botsettings.remove(key, category.id, 'disabledCategories');
        message.channel.send(`The ${category.name} categories channels will now run commands again.`);
      };
    } else if (args[0] === 'cmdcategory') {
      const categories = [];
      client.commands.forEach(cmd => {
        if (!categories.includes(cmd.category)) {
          categories.push(cmd.category);
        };
      });
      if (!categories.includes(args[1])) return message.channel.send(`${args[1]} is not a valid command category.`);
      if (!client.botsettings.get(key, 'disabledCommandCategories').includes(args[1])) {
        client.botsettings.push(key, args[1], 'disabledCommandCategories');
        message.channel.send(`Commands from the ${args[1]} category will no longer run.`);
      } else {
        client.botsettings.remove(key, args[1], 'disabledCommandCategories');
        message.channel.send(`Commands from the ${args[1]} category will run again.`);
      };
    } else {
      message.channel.send(`${args[0]} is not a valid option, refer to "help toggle" to see the options.`);
    };
  },
};