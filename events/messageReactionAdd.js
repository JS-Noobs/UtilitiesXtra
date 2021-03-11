module.exports = async (client, reaction, user) => {
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  const embed = reaction.message.embeds[0];
  const message = reaction.message;
  const up = message.reactions.cache.filter(r => r.emoji.name === '👍').size;
  const down = message.reactions.cache.filter(r => r.emoji.name === '👎').size;
  const embed2 = embed;
  if(up > down) {
    embed2.setColor('GREEN')
  } else if(up === down) {
    embed2.setColor('ORANGE')
  } else if(up < down) {
    embed2.setColor('RED')
  };
  message.edit(embed2);
  if(client.votechannels.get(reaction.message.guild.id, 'channels').includes(reaction.message.channel.id)) {
    if(embed.footer.text.includes(user.id)) {
      reaction.users.remove(user.id);
    };
  };
};