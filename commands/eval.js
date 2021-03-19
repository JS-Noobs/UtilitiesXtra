const { MessageEmbed } = require('discord.js');

module.exports = {
  name: 'eval',
  alias: [],
  description: 'Eval',
  category: 'developer',
  permissions: [],
  botpermissions: [],
  developer: true,
  execute(message, args, client) {
    require('../upgrades.json')
    const clean = text => {
      if (typeof (text) === "string") return text.replace(/`/g, "`" + String.fromCharCode(8203)).replace(/@/g, "@" + String.fromCharCode(8203));
      else return text;
    }
    const argsone = message.content.split(/\n+|\s+/).slice(1);
    if (argsone.join(" ").includes(client.token)) return

    try {
      const code = argsone.join(" ");
      let evaled = eval(code);

      if (clean(evaled) === client.token) return
      if (typeof evaled !== "string") evaled = require("util").inspect(evaled);

      message.channel.send(clean(evaled), { code: "xl" });
    } catch (err) {
      if (err.length > 2000) return
      message.channel.send(`\`ERROR\` \`\`\`xl\n${clean(err)}\n\`\`\``);
    };
  },
};