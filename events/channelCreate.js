const { MessageEmbed } = require('discord.js');
module.exports = async (client, channel) => {
  if(channel.type === 'dm') return;
  if (!channel.guild.roles.cache.has(client.botsettings.get(channel.guild.id, 'mutedRole'))) await channel.guild.roles.create({
      data: {
        name: 'Muted',
        color: 'GRAY',
        permissions: [
          "VIEW_CHANNEL"
        ]
      },
    }).then(role => {
      client.botsettings.set(channel.guild.id, role.id, 'mutedRole')
      channel.guild.channels.cache.forEach(x => x.updateOverwrite(role.id, {
        SEND_MESSAGES: false
      }));
    });

    const muted = channel.guild.roles.cache.get(client.botsettings.get(channel.guild.id, 'mutedRole')) || channel.guild.roles.cache.find(x => x.name.toLowerCase().includes('muted'));
    channel.updateOverwrite(muted.id, {
      SEND_MESSAGES: false
    });
};