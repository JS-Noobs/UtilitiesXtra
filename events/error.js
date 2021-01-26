const {MessageEmbed} = require('discord.js');
module.exports = async (client, error) => {
  const embed = new MessageEmbed()
  .setTitle('ERROR')
  .setDescription(error)
  .setColor('RED')
  client.channels.cache.get('783463934573281281').send(embed).catch(err => {
    console.log(err)
  });
};