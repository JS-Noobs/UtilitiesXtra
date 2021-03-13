const { MessageEmbed } = require('discord.js');
module.exports = async (client, channel) => {
  if(channel.type === 'dm') return;
  if (!message.guild.roles.cache.has(client.botsettings.get(message.guild.id, 'mutedRole'))) await message.guild.roles.create({
      data: {
        name: 'Muted',
        color: 'GRAY',
        permissions: [
          "VIEW_CHANNEL"
        ]
      },
    }).then(role => {
      client.botsettings.set(message.guild.id, role.id, 'mutedRole')
      message.guild.channels.cache.forEach(x => x.updateOverwrite(role.id, {
        SEND_MESSAGES: false
      }));
    });

    const muted = message.guild.roles.cache.get(client.botsettings.get(message.guild.id, 'mutedRole')) || message.guild.roles.cache.find(x => x.name.toLowerCase().includes('muted'));
    channel.updateOverwrite(muted.id, {
      SEND_MESSAGES: false
    });
};