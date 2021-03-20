module.exports = async (client, message) => {
  client.permissions.ensure(message.guild.id, {
    moderatorRoles: [],
    adminRoles: []
  });
};