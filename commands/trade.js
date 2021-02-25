const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'trade',
  alias: [],
  description: 'Trade items with other users',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
  execute: async(message, args, client) => {
    const member = message.mentions.members.first();
    if(client.trading.get(message.guild.id, 'ongoing').some(x => x.starter.id === message.member.id || x.trader.id === member.id)) {

    } else {
      if(!member) return message.channel.send(`Mention the user you wish to start trading with`);
      message.channel.send(`${member}, ${message.member} wishes to start a trade with you, to accept type \`accept\` `);
      const msgs = message.channel.awaitMessages(msg => msg.member.id === member.id && msg.content.toLowerCase() === 'accept', {time: 30000});


      //const obj = {starter: {id: message.member.id, items: [], accepted: false}, trader: {id: member.id, items: [], accepted: false}};
      //client.trading.push(message.guild.id, obj, 'ongoing');
    }
  },
};