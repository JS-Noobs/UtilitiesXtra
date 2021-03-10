module.exports = async (client, reaction, user) => {
  if(client.votechannels.get(message.guild.id, 'channels').includes(reaction.message.channel.id)) {
    if(user.id === reaction.message.author.id) reaction.users.remove(user.id)
  };
};