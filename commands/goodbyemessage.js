const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'goodbyemessage',
  alias: ['gmsg', 'goodbyesettings', 'gsettings'],
  description: 'Settings for the goodbye message',
  category: 'guildsettings',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  developer: false,
  execute(message, args, client) {
    if (!args[0]) return message.channel.send(`Please enter one of following options: \`toggle, list, add, remove, channel\``);
    const key = message.guild.id;
    if (args[0] === 'toggle') {
      const cur = client.botsettings.get(key, 'sendBye');
      client.botsettings.set(key, !cur, 'sendBye');
      const nc = client.botsettings.get(key, 'sendBye');
      const embed = new MessageEmbed()
      if (nc === true) {
        embed.setTitle(`Goodbye message has been enabled.`)
          .setColor('GREEN')
      } else if (nc === false) {
        embed.setTitle(`Goodbye message has been disabled.`)
          .setColor('RED')
      };
      return message.channel.send(embed);
    } else if (args[0] === 'list') {
      let page = parseInt(args[1]) || 1;
      const messages = client.botsettings.get(key, 'goodbyeMessage');
      const mess = [];
      messages.forEach(x => {
        mess.push(x);
      })
      const total = mess.length;
      if (page > Math.ceil(total / 10)) page = Math.ceil(total / 10);
      const msgs = mess.splice(page * 10 - 10, 10)
      const embed = new MessageEmbed()
        .setTitle(`Goodbye messages`)
        .setDescription(`\`\`\`${msgs.map(x => `${msgs.indexOf(x)}. ${x}`).join('\n')}\`\`\``)
        .setFooter(`Page ${page}/${Math.ceil(total / 10)}`);

      return message.channel.send(embed);
    } else if (args[0] === 'add') {
      const toAdd = message.content.split(' ').slice(2).join(' ');
      async function confirm() {
        let msg = await message.channel.send(`Are you sure you want \`\`\`${toAdd}\`\`\`as a goodbye message?`)
        await msg.react('👍');
        await msg.react('👎');

        let reacts = await msg.awaitReactions((reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id, { max: 1, time: 15000, errors: ['time'] }).catch(err => {
          message.channel.send('You took too long to react, command was canceled').then(x => x.delete({ timeout: 5000 }));
          return msg.delete();
        });
        if (reacts.size > 0 && reacts.first().emoji.name === '👍') {
          client.botsettings.push(key, toAdd, 'goodbyeMessage');
          return message.channel.send(`The message was added as a goodbye message`);
        } else if (reacts.size > 0 && reacts.first().emoji.name === '👎') {
          return message.channel.send(`Command was canceled.`);
        };
      };
      confirm();
    } else if (args[0] === 'remove') {
      if (!args[1]) message.channel.send(`Please enter the message you wish to remove. You can see their # by using the *list* option.`)
      const toDel = parseInt(args[1]);
      const messages = client.botsettings.get(message.guild.id, 'goodbyeMessage');
      if (toDel > messages.length) return message.channel.send(`There is not any message #${toDel}`);
      async function confirm() {
        let msg = await message.channel.send(`Are you sure you wish to delete following message? \`\`\`${messages[toDel]}\`\`\``)
        await msg.react('👍');
        await msg.react('👎');

        let reacts = await msg.awaitReactions((reaction, user) => ['👍', '👎'].includes(reaction.emoji.name) && user.id === message.author.id, { max: 1, time: 15000, errors: ['time'] }).catch(err => {
          message.channel.send('You took too long to react, command was canceled').then(x => x.delete({ timeout: 5000 }));
          return msg.delete();
        });
        if (reacts.size > 0 && reacts.first().emoji.name === '👍') {
          client.botsettings.remove(key, messages[toDel], 'goodbyeMessage');
          return message.channel.send(`The message was removed from the list of goodbyes`);
        } else if (reacts.size > 0 && reacts.first().emoji.name === '👎') {
          return message.channel.send(`Command was canceled.`);
        };
      };
      confirm();
    } else if (args[0] === 'channel') {
      if (!args[1]) return message.channel.send(`Please enter a channel you wish to send the goodbye message in.`);
      const channel = message.mentions.channels.first() || message.guild.channels.cache.get(args[1]) || message.guild.channels.cache.find(x => x.name.toLowerCase().includes(args[1]));
      if (!channel) return message.channel.send(`${args[1]} is not a valid channel`);
      client.botsettings.set(key, channel.id, 'goodbyeChannel');
      return message.channel.send(`${channel} has been set to the goodbye channel.`);
    } else {
      return message.channel.send(`Please enter one of following options: \`toggle, list, add, remove, channel\``)
    };
  },
};