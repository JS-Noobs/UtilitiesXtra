const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');

module.exports = {
	name: 'botinfo',
  alias: ['binfo'],
	description: 'Shows bot information',
  category: 'bot',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    let users = 0; client.guilds.cache.forEach(g => users += g.memberCount);
    const guilds = client.guilds.cache.size;
    const commands = client.commands.size;
    const version = '1.0.7';
    const support = '[Discord](https://discord.gg/BbyWYAYabH "This will take you to the support server")';
    const trello = '[Upcoming](https://github.com/LightBlueGamer/UtilitiesXtra/projects/1?fullscreen=true)'
    const full = version.split('.').splice(0, 1);
    const release = version.split('.').splice(1, 1);
    const development = version.split('.').splice(2, 1);
    const patch = `[Github](https://github.com/JS-Noobs/UtilitiesXtra)`;
    const sponsors = [];

    async function addPartner(id) {
      const server = client.guilds.cache.get(id);
      if(!server) return
      const channel = server.channels.cache.filter(x => x.type === 'text').first();
      const invite = await channel.createInvite({maxAge: 0})
      sponsors.push(`[${server.name}](${invite.url})`)
    };

    await addPartner('759577530528694293');
		
    const string = ms(client.uptime)
    const arr = string.split(' ');

    const embed = new MessageEmbed()
    .setTitle(`${client.user.username} ${version}`)
    .setDescription(`**Partnered servers**\n`+sponsors.join('\n')+'\n---\n[Invite Me!](https://top.gg/bot/780858079096995840/invite)')
    .addField('Users', users, true)
    .addField('Servers', guilds, true)
    .addField('Commands', commands, true)
    .addField('Github', patch, true)
    .addField('Updates', trello, true)
    .addField('Support', support, true)
    .setFooter(`Online for ${arr.splice(0, arr.length-1).join(' ') + ` ${arr[0].replace(/\.\d/igm, '')}`}!`)

    message.channel.send(embed);
  },
};
