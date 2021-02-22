const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');
const moment = require('moment');
module.exports = {
  name: 'warn',
  alias: [],
  description: 'Add, remove or show warns for a user.',
  category: 'moderation',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
  execute(message, args, client) {
    return;
    function rando() {
      let id = '';
      for(let i = 0; i<15; i++) {
        id += Math.floor(Math.random() * 15);
      };
      return id;
    };

    let cid = rando();
    while(client.warns.filter(x => x.guild === message.guild.id).some(x => x.caseId === cid)) cid = rando();
    if (!args[0]) {
      const member = message.mentions.members.first();
      const executor = message.member;
      if(!executor.permissions.has('KICK_MEMBERS')) return message.channel.send(`You need the \`KICK_MEMBERS\` permission to warn members`);
      if(member.roles.highest.position > executor.roles.highest.position) return message.channel.send(`You can't warn someone with a higher role than yourself`);
      const date = new Date()
      const formatted = moment(date).format("MMMM Do YYYY, HH:mm");
      const obj = {
        caseId: cid,
        guild: message.guild.id,
        executor: message.member.id,
        reason: args.slice(2).join(' '),
        time: formatted
      };
      client.warns.push(`${message.guild.id}-${member.id}`, obj, 'warns');
      message.channel.send(`Member ${member} was warned by ${executor}\nReason: ${args.slice(1).join(' ')}`);
    } else if (args[0] === 'show') {
      const member = message.mentions.members.first();
      const warns = client.warns.get(`${message.guild.id}-${member.id}`, 'warns');
      const embed = new MessageEmbed()
        .setTitle(`Warnings for ${member.displayName}`)
        .setDescription(`Current warnings: ${warns.length}`)
      warns.forEach(x => {
        embed.addField(`Case #${x.case}`, `Warned by: ${x.executor} at ${x.time}\nReason: ${x.reason}`)
      })
        .setFooter(`Requested by ${message.member.displayName}`)

      message.channel.send(embed);
    } else if (args[0] === 'remove') {
      
    };
  },
};