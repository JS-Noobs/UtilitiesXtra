module.exports = async (client, message) => {
  client.permissions.ensure(message.guild.id, {});
  client.commands.forEach(cmd => {
    if(cmd.developer === false) {
      const name = cmd.name;
      client.permissions.set(message.guild.id, {name: []});
    };
  });
};