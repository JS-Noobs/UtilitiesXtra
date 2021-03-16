const { MessageEmbed } = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
  name: 'giveaway',
  alias: [],
  description: 'Start or end a giveaway',
  category: 'development',
  permissions: ['MANAGE_GUILD'],
  botpermissions: [],
  development: false,
  developer: true,
  ea: false,
  execute: async(message, args, client) => {
    return
    if(!args[0]) return message.channel.send(`Please use either the \`start\` or \`end\` option.`);
    if(args[0] === 'start'){
      message.channel.send(`Please send the amount of winners (max ${message.guild.memberCount})`);
      const am1 = 
    } else if(args[0] === 'end'){

    };
    
  },
};