module.exports = async (client, reaction, user) => {
  if(reaction.partial) await reaction.fetch()
  if(client.votechannels.get(reaction.message.guild.id, 'channels').includes(reaction.message.channel.id)) {
    if(user.id === reaction.message.author.id) {
      reaction.users.remove(user.id);
    };
  };
};