module.exports = async (client, reaction, user) => {
  if(reaction.partial) await reaction.fetch();
  if(user.bot) return;
  if(client.votechannels.get(reaction.message.guild.id, 'channels').includes(reaction.message.channel.id)) {
    const embed = reaction.message.embeds[0]
    if(embed.footer.text.includes(user.id)) {
      reaction.users.remove(user.id);
    };
  };
};