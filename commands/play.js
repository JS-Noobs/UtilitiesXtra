const {MessageEmbed} = require('discord.js');
const shop = require('../shop.json');
const upgrades = require('../upgrades.json');
const monsters = require('../monsters.json');
const timeout = new Set();
const ytdl = require('ytdl-core');
module.exports = {
	name: 'play',
  alias: ['youtube', 'yt'],
	description: 'Play music',
  category: 'music',
  permissions: [],
  botpermissions: ['CONNECT', 'SPEAK'],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    const vc = message.member.voice.channel;
    if(!vc) return message.channel.send(`You have to be in a voice channel to play music`);
    const connection = await vc.join();
    const dispatcher = await connection.play(await ytdl(args[0]), { type: 'opus' });
    dispatcher.on('debug', debug => {
			console.log(debug);
		});
  },
};
