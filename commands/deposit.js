const {MessageEmbed} = require('discord.js');

module.exports = {
	name: 'deposit',
  alias: ['dep'],
	description: 'Deposit money to your bank account.',
  category: 'economy',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute(message, args, client) {
    if(!args[0]) return message.channel.send(`Please select an amount to deposit or deposit all.`);
    let amount = args[0];
    const key = `${message.guild.id}-${message.member.id}`;
    if(amount === 'all'){
      const bal = client.economy.get(key, 'wallet');
      if(bal < 1) return message.channel.send(`You need to transfer atleast $1.`);
      client.economy.math(key, '+', bal, 'bank');
      client.economy.math(key, '-', bal, 'wallet');
      message.channel.send(`Your transaction of \`$${bal}\` to your bank was successful.`);
    } else if(!isNaN(parseInt(amount))){
      amount = parseInt(amount);
      const bal = parseInt(client.economy.get(key, 'wallet'));
      if(amount > bal) return message.channel.send(`Transaction denied, not enough money.`);
      if(amount < 1) return message.channel.send(`You need to transfer atleast $1.`);
      client.economy.math(key, '+', amount, 'bank');
      client.economy.math(key, '-', amount, 'wallet');
      message.channel.send(`Your transaction of \`$${amount}\` was successful.`);
    } else {
      message.channel.send(`Invalid amount selected.`)
    };
  },
};