//==========================================================//
const { config } = require('./config.json');
const express = require('express');
const app = express();
const port = 3000;
const router = express.Router();
const path = require('path');
app.get('/', (req, res) => res.send('Bot is up and working!'));
app.listen(port, () => { });
//==========================================================//
const Discord = require('discord.js');
const Enmap = require('enmap');
const fs = require('fs');
//==========================================================//
router.get('/', function (req, res) {
  res.sendFile(path.join('/dashboard/index.html'));
});
app.use('/', router);
//==========================================================//
const client = new Discord.Client();
//==========================================================//
client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.guildsettings = new Enmap({ name: 'guildsettings' });
client.mute = new Enmap({ name: 'mute' });
client.tempban = new Enmap({ name: 'tempban' });
client.botsettings = new Enmap({ name: 'botsettings' });
client.economy = new Enmap({ name: 'economy' });
client.kill = new Enmap({ name: 'kill' });
client.blocks = new Enmap({ name: 'blocks' });
client.rroles = new Enmap({ name: 'rroles' });
client.inventory = new Enmap({ name: 'inventory' });
client.stats = new Enmap({ name: 'stats' });
client.usersettings = new Enmap({ name: 'usersettings' });
client.adventures = new Enmap({ name: 'adventures' });
client.mkills = new Enmap({ name: 'mkills' });
client.warning = new Enmap({ name: 'warning' });
client.jobs = new Enmap({ name: 'jobs' });
client.adventure = new Enmap({ name: 'adventure' });
client.votechannels = new Enmap({ name: 'votechannels' });
client.miner = new Enmap({ name: 'miner' });
client.messages = new Enmap({ name: 'messages' });
client.queue = new Enmap({ name: 'queue' });
client.hangman = new Enmap({ name: 'hangman' });
client.hmstats = new Enmap({ name: 'hmstats' });
client.warns = new Enmap({ name: 'warns' });
client.warnsettings = new Enmap({ name: 'warnsettings' })
//==========================================================//
client.globaleco = new Enmap({ name: 'globaleco' });
//==========================================================//
client.login(config)
//==========================================================//
fs.readdir("./events/", (err, files) => {
  if (err) return console.error(err);
  let cur = 0;
  files.forEach(file => {
    cur++
    const event = require(`./events/${file}`);
    let eventName = file.split(".")[0];
    console.log(`Loaded event: ${eventName} (${cur}/${files.length}).`)
    client.on(eventName, event.bind(null, client));
    client.events.set(eventName)
  });
  console.log(`Loaded ${client.events.size} events.`)
});

const commandFiles = fs.readdirSync('./commands').filter(file => file.endsWith('.js'));
let cur2 = 0;
for (const file of commandFiles) {
  cur2++
  const command = require(`./commands/${file}`);
  client.commands.set(command.name, command);
  console.log(`Loaded command: ${command.name} (${cur2}/${commandFiles.length}).`);
};
console.log(`Loaded ${client.commands.size} commands.`);
//==========================================================//
