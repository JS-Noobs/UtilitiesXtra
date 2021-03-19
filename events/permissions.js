module.exports = async (client, message) => {
  client.permissions.ensure(message.guild.id, {});
  client.commands.forEach(cmd => {
    if(cmd.developer === false) {
      client.permissions.set(message.guild.id, {cmd.name: []});
    };
  });
};