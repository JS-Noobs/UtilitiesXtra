const shop = require('../shop.json');
module.exports = async (client) => {

  client.partners.ensure(client.user.id, {
    partners: []
  })
  client.warning.forEach(x => x.sent = false)

  client.mute.keyArray().forEach(key => {
    console.log('Ready to help!')
    const date = new Date();
    const uDate = client.mute.get(key, 'unmuteDate');
    const guild = client.guilds.cache.get(client.mute.get(key, 'guild'));
    if (date >= uDate) {
      guild.members.fetch(client.mute.get(key, 'member')).then(member => {
        member.send(`You have been unmuted in ${guild.name}`);
        member.roles.set(client.mute.get(key, 'roles'));
        client.mute.delete(key);
      });
    } else {
      const time = Date.parse(uDate) - Date.parse(date);
      setTimeout(() => {
        guild.members.fetch(client.mute.get(key, 'member')).then(member => {
          member.send(`You have been unmuted in ${guild.name}`);
          member.roles.set(client.mute.get(key, 'roles'));
          client.mute.delete(key);
        });
      }, time);
    };
  });

  client.tempban.keyArray().forEach(key => {
    const date = new Date();
    const uDate = client.tempban.get(key, 'unmuteDate');
    const guild = client.guilds.cache.get(client.tempban.get(key, 'guild'));
    const member = client.tempban.get(key, 'member');
    if (date >= uDate) {
      guild.members.unban(member);
      client.tempban.delete(key);
    } else {
      const time = Date.parse(uDate) - Date.parse(date);
      setTimeout(() => {
        guild.members.unban(member);
        client.tempban.delete(key);
      });
    };
  });

  //Bot stats
  client.channels.cache.get('785175685625937950').setName(`Guilds: ${client.guilds.cache.size}`);
  let users = 0;
  client.guilds.cache.forEach(g => {
    users += g.memberCount
  });
  client.user.setPresence({ activity: { name: `over ${users} members!`, type: "WATCHING" }, status: 'online' })
  client.channels.cache.get('794844798065311765').setName(`Users: ${users}`);

  let cur = 0;
  client.setInterval(() => {
    client.channels.cache.get('785175685625937950').setName(`Guilds: ${client.guilds.cache.size}`);
    let users = 0;
    client.guilds.cache.forEach(g => {
      users += g.memberCount
    });

    const presences = [
      { name: `over ${users} members!`, type: "WATCHING" },
      { name: `for ${client.commands.size} commands in ${client.guilds.cache.size} servers`, type: "LISTENING" }
    ]
    if (cur + 1 > presences.length) cur = 0;

    const presence = presences[cur];

    client.user.setPresence({ activity: { name: presence.name, type: presence.type }, status: 'online' });
    cur++
    client.channels.cache.get('794844798065311765').setName(`Users: ${users}`);
  }, 1000 * 15)

  console.log("READY!")
};