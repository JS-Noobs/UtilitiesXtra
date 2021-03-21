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
const client = new Discord.Client({ partials: ['MESSAGE', 'CHANNEL', 'REACTION'] });
//==========================================================//
client.events = new Discord.Collection();
client.commands = new Discord.Collection();
client.guildsettings = new Enmap({ name: 'guildsettings', autoEnsure: { prefix: '!' } });
client.mute = new Enmap({ name: 'mute' });
client.tempban = new Enmap({ name: 'tempban' });
client.botsettings = new Enmap({
  name: 'botsettings', autoEnsure: {
    sendLogs: true,
    logChannel: '',
    ignoreRolesLog: [],
    ignoreChannelsLog: [],
    ignoreUsersLog: [],
    sendWelcome: true,
    welcomeChannel: '',
    welcomeMessage: ['Welcome {member} to {server}! You are the {count} member to join!'],
    sendBye: true,
    goodbyeChannel: '',
    goodbyeMessage: ['{member} has left us all alone, there are now only {count} members left.'],
    xpMessage: true,
    xpChannel: '',
    disabledChannels: [],
    disabledCategories: [],
    disabledUsers: [],
    disabledCommands: [],
    disabledCommandCategories: [],
    mutedRole: '',
    autoRoles: [],
    verification: false,
    verificationRoles: [],
    modRoles: [],
    adminRoles: [],
    lockdownBlacklist: []
  }
});
client.economy = new Enmap({
  name: 'economy', autoEnsure: {
    wallet: 0,
    bank: 0,
    total: 0,
    xp: 0,
    level: 1,
    levelInc: 0,
    member: '',
    guild: ''
  }
});
client.kill = new Enmap({
  name: 'kill', autoEnsure: {
    kills: 0,
    deaths: 0
  }
});
client.blocks = new Enmap({ name: 'blocks', autoEnsure: { users: [] } });
client.rroles = new Enmap({ name: 'rroles' });
client.inventory = new Enmap({
  name: 'inventory', autoEnsure: {
    level: 1,
    max: 10,
    items: []
  }
});
client.stats = new Enmap({
  name: 'stats', autoEnsure: {
    strength: 0,
    endurance: 0,
    stealth: 0,
    barter: 0,
    luck: 0,
    intelligence: 0,
    mining: 0,
    guild: '',
    member: ''
  }
});
client.usersettings = new Enmap({ name: 'usersettings', autoEnsure: { xpping: false } });
client.adventures = new Enmap({ name: 'adventures' });
client.mkills = new Enmap({
  name: 'mkills', autoEnsure: {
    monsters: []
  }
});
client.warning = new Enmap({ name: 'warning', autoEnsure: { sent: false } });
client.jobs = new Enmap({
  name: 'jobs', autoEnsure: {
    job: "",
    rank: "",
    pay: 0,
    nxtPay: 0
  }
});
client.adventure = new Enmap({
  name: 'adventure', autoEnsure: {
    monster: "",
    level: 0,
    xp: 0,
    moneyreward: 0,
    difficulty: 0,
    highestLvl: 0,
    member: '',
    guild: '',
    lifes: 3
  }
});
client.votechannels = new Enmap({
  name: 'votechannels', autoEnsure: {
    channels: [],
    yes: '👍',
    no: '👎'
  }
});
client.miner = new Enmap({
  name: 'miner', autoEnsure: {
    miner: 1,
    totalMiner: 1,
    pickaxe: 0,
    totalPickaxe: 0,
    mine: "",
    ore: "",
    xp: 0,
    totalXp: 0,
    trolley: [],
    maxTrolley: 5,
    mineCoins: 0,
    skips: 0,
    skipLevel: 0,
    oresMined: 0,
    minedOres: []
  }
});
client.messages = new Enmap({
  name: 'messages', autoEnsure: {
    total: 0,
    nextDay: 0,
    dailyMessages: 0,
    member: '',
    guild: ''
  }
});
client.queue = new Enmap({ name: 'queue' });
client.hangman = new Enmap({ name: 'hangman' });
client.hmstats = new Enmap({ name: 'hmstats' });
client.warns = new Enmap({ name: 'warns', autoEnsure: { warns: [] } });
client.warnsettings = new Enmap({
  name: 'warnsettings', autoEnsure: {
    mute: 2,
    kick: 3,
    ban: 5,
    muteTime: '15m',
    banTime: '1d',
  }
});
client.trading = new Enmap({ name: 'trading', autoEnsure: { ongoing: [] } });
client.joinroles = new Enmap({
  name: 'joinrole', autoEnsure: {
    roles: [],
    enabled: false
  }
});
client.giveaways = new Enmap({ name: 'giveaways', autoEnsure: { ongoing: [] } });
client.partners = new Enmap({ name: 'partners' });
client.permissions = new Enmap({ name: 'permissions' });
//==========================================================//
client.globaleco = new Enmap({
  name: 'globaleco', autoEnsure: {
    money: 0,
    xp: 0,
    level: 0,
    member: '',
    uCoins: 0,
    xpboosts: [],
    balboosts: [],
    permxpboost: 1,
    permbalboost: 1,
    tempxpboost: 0,
    tempbalboost: 0,
    prestige: 0,
    requiredxp: 750
  }
});
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
