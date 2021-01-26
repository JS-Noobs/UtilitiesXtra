const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');
const set = new Set();

module.exports = {
	name: 'rob',
  alias: [],
	description: 'Rob a member of their money.',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    if(!args[0]) return message.channel.send(`Please mention the member you wish to rob.`);

    const member = message.mentions.members.first() || message.guild.members.cache.get(args[0]) || message.guild.members.cache.find(x => x.displayName.toLowerCase().startsWith(args[0])) || message.guild.members.cache.find(x => x.user.tag.toLowerCase() === args[0]);
    if(!member) return message.channel.send(`No valid member was found.`);

    const key = `${message.guild.id}-`
    const memberBalance = client.economy.get(key+member.id, 'wallet');
    const authorBalance = client.economy.get(key+message.member.id, 'total');

    if(!args[1]) return message.channel.send(`Select amount to attempt to rob.`)
    const attempt = parseInt(args[1]);
    if(!attempt) return message.channel.send(`Invalid amount.`);
    const tenth = Math.floor(memberBalance * 0.10);
    const forth = Math.floor(memberBalance * 0.25);
    const half = Math.floor(memberBalance * 0.50);
    const threes = Math.floor(memberBalance * 0.75);
    const ninety = Math.floor(memberBalance * 0.90);
    const tenthA = Math.floor(attempt * 0.10);
    const forthA = Math.floor(attempt * 0.25);
    const halfA = Math.floor(attempt * 0.50);
    const threesA = Math.floor(attempt * 0.75);
    const ninetyA = Math.floor(attempt * 0.90);
    
    const chance = Math.floor(Math.random() * 99) + 1;
    const keys = `${message.guild.id}-${message.member.id}`;
    if(set.has(keys)) return message.channel.send(`You can't rob someone again it will be too suspicious, wait a few minutes.`);
    else set.add(keys);
    setTimeout(() => {
      set.delete(keys);
    }, 1000 * 60 * 10);

    async function swap(amount){
      client.economy.math(`${message.guild.id}-${message.member.id}`, '+', amount, 'wallet');
      client.economy.math(`${message.guild.id}-${message.member.id}`, '+', amount, 'total');
      client.economy.math(`${message.guild.id}-${member.id}`, '-', amount, 'wallet');
      client.economy.math(`${message.guild.id}-${member.id}`, '-', amount, 'total');

      message.channel.send(`You successfully robbed ${member.displayName} and took $${amount} from them.`);
    };
    async function fail(amount){
      client.economy.math(`${message.guild.id}-${message.member.id}`, '-', amount, 'wallet');
      client.economy.math(`${message.guild.id}-${message.member.id}`, '-', amount, 'total');

      message.channel.send(`You tried to rob ${member.displayName} but were caught and fined ${amount}`);
    };

    if(attempt < 1){
      return message.channel.send(`You cant rob someone of $0`);
      set.delete(keys);
    }
    if(attempt > 0 && attempt <= tenth){
      if(chance <= 80){
        swap(attempt);
      } else {
        fail(tenthA);
      };
    }else if(attempt > tenth && attempt <= forth){
      if(chance <= 65){
        swap(attempt);
      } else {
        fail(forthA);
      };
    }else if(attempt > forth && attempt <= half){
      if(chance <= 40){
        swap(attempt);
      } else {
        fail(halfA);
      };
    }else if(attempt > half && attempt <= threes){
      if(chance <= 25){
        swap(attempt);
      } else {
        fail(threesA);
      };
    }else if(attempt > threes && attempt <= ninety){
      if(chance <= 10){
        swap(attempt);
      } else {
        fail(ninetyA);
      };
    }else if(attempt > ninety && attempt <= memberBalance){
      if(chance <= 5){
        swap(attempt);
      } else {
        fail(attempt);
      };
    } else {
      message.channel.send(`You can't rob someone of more than they have.`);
      set.delete(keys);
    };
    
  },
};