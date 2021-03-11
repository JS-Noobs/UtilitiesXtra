module.exports = async (client, reaction, user) => {
  if (reaction.partial) await reaction.fetch();
  if (user.bot) return;
  if (client.votechannels.get(reaction.message.guild.id, 'channels').includes(reaction.message.channel.id)) {
    const embed = reaction.message.embeds[0];
    const message = reaction.message;
    const up = message.reactions.cache.find(r => r.emoji.name === '👍');
    const down = message.reactions.cache.find(r => r.emoji.name === '👎');
    const embed2 = embed;
    if(up.users.cache.has(user.id)) return reaction.users.remove(user.id);
    if(down.users.cache.has(user.id)) return reaction.users.remove(user.id);
    if (up.count > down.count) {
      embed2.setColor('GREEN')
    } else if (up.count === down.count) {
      embed2.setColor('ORANGE')
    } else if (up.count < down.count) {
      embed2.setColor('RED')
    };
    message.edit(embed2);

    if (embed.footer.text.includes(user.id)) {
      reaction.users.remove(user.id);
    };
  };
};