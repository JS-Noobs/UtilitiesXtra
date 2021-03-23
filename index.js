const Discord = require('discord.js');
const fs = require('fs');
const extensions = fs.readdirSync("./extensions");
extensions.forEach(ext => {
  require(`./extensions/${ext}`);
  console.log(`Loaded extension: ${ext}`)
});
const client = new Discord.Client({partials: ['MESSAGE', 'CHANNEL', 'REACTION']});
const Enmap = require('enmap');

client.events = new Discord.Collection();
client.commands = new Discord.Collection();

client.settings = new Enmap({name: 'settings', autoEnsure: {
  prefix: '!',
  logger: '',
  logChannel: ''
}});

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

let curFile = 0;
const folders = fs.readdirSync(`./commands`).filter(folder => !folder.includes('.'));
folders.forEach(folder => {
  const files = fs.readdirSync(`./commands/${folder}`).filter(file => file.endsWith('.js'));
  files.forEach(file => {
    const command = require(`./commands/${folder}/${file}`);
    client.commands.set(command.name, command);
    curFile++;
    console.log(`Loaded command ${command.name}.js`)
  });
});

async function login() {
  client.login();
};

login()