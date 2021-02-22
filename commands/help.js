const { MessageEmbed } = require('discord.js');
const servers = require('../eas.json');

module.exports = {
  name: 'help',
  alias: [],
  description: 'Shows the bots commands',
  category: 'info',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
  execute(message, args, client) {
    if (args[0] === 'easter') {
      if (args[1] === 'egg') {
        return message.channel.send('https://tenor.com/view/easter-easter-egg-gif-8278876');
      };
    };
    const prefix = client.guildsettings.get(message.guild.id, 'prefix');

    let commands = client.commands;
    commands = commands.filter(cmd => message.member.permissions.has(cmd.permissions));
    commands = commands.filter(cmd => !cmd.development);
    commands = commands.filter(cmd => cmd.category !== 'development');
    if (!servers.includes(message.guild.id)) commands = commands.filter(cmd => !cmd.ea)
    commands = commands.sort((x, y) => x.name);

    let categories = [];
    commands.forEach(c => {
      if (!categories.includes(c.category)) {
        categories.push(c.category);
      };
    });
    categories.sort((x, y) => x.name).sort((a, b) => {
      let fa = a.toLowerCase();
      let fb = b.toLowerCase();

      if (fa < fb) {
        return -1;
      }
      if (fa > fb) {
        return 1;
      }
      return 0;
    });

    if (!args[0] || !isNaN(parseInt(args[0]))) {
      let page = parseInt(args[0]) || 1;
      const total = categories.length;
      if (page > Math.ceil(total / 9)) page = Math.ceil(total / 9);
      categories = categories.splice(page * 9 - 9, 9);
      const embed = new MessageEmbed()
        .setTitle(`${client.user.username} categories.`)
      categories.forEach(c => embed.addField(`${c.replace(c[0], c[0].toUpperCase())} category.`, `Use ${prefix}help ${c} to show all ${commands.filter(cmd => cmd.category === c).size} commands in the category`, true));
      embed.setFooter(`Page ${page}/${Math.ceil(total / 9)}`)
      message.channel.send(embed).catch(err => console.error(err));
    } else if (categories.includes(args[0])) {
      let page = parseInt(args[1]) || 1;
      commands = commands.filter(cmd => cmd.category === args[0]).sort((x, y) => x.name);
      const total = commands.size;
      if (page > Math.ceil(total / 9)) page = Math.ceil(total / 9);
      let cmds = [];
      commands.forEach(x => cmds.push(x));
      cmds = cmds.splice(page * 9 - 9, 9)
      const embed = new MessageEmbed()
        .setTitle(`${args[0].replace(args[0][0], args[0][0].toUpperCase())} commands.`)
      cmds.forEach(c => embed.addField(`${c.name.replace(c.name[0], c.name[0].toUpperCase())} command.`, `Use ${prefix}help ${c.name} to show information about the ${c.name} command.`, true));
      embed.setFooter(`Page ${page}/${Math.ceil(total / 9)}`)
      message.channel.send(embed).catch(err => {
        console.error(err);
        message.channel.send(`It seems I don't have permissions to send embeds here. Please give me EMBED_LINKS permissions.`)
      });
    } else if (commands.get(args[0]) || commands.find(c => c.alias && c.alias.includes(args[0]))) {
      const cmd = commands.get(args[0]) || commands.find(c => c.alias && c.alias.includes(args[0]));
      let aliases = [];
      cmd.alias.forEach(a => aliases.push(`${prefix}${a}`));
      let permissions = cmd.permissions.map(p => `\`${p}\` `);
      if (permissions.length <= 0) permissions = 'None required.';
      const embed = new MessageEmbed()
        .setTitle(`${cmd.name.replace(cmd.name[0], cmd.name[0].toUpperCase())}`)
        .setDescription(cmd.description)
        .addField(`Usage`, `${prefix}${cmd.name}\n${aliases.join(`\n`)}`, true)
        .addField(`\u200b`, `\u200b`, true)
        .addField(`Category`, `${cmd.category}`, true)
        .addField(`Permissions required`, `${permissions}`)
      message.channel.send(embed).catch(err => {
        console.error(err);
        message.channel.send(`It seems I don't have permissions to send embeds here. Please give me EMBED_LINKS permissions.`)
      });
    };
  },
};