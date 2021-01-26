const {MessageEmbed} = require('discord.js');
const ms = require('pretty-ms');
const mines = require('../mining.json');
const search = new Set();
const pause = new Set();

module.exports = {
	name: 'mine',
  alias: ['mining'],
	description: 'Go to the mine and dig!',
  category: 'rpg',
  permissions: [],
  botpermissions: [],
  development: false,
  ea: false,
	execute: async(message, args, client) => {
    const key = `${message.guild.id}-${message.member.id}`;
    if(!args[0]) return message.channel.send(`Missing 2nd parameter, available options:\n${['`stats`', '`mines`', '`show`', '`go`', '`dig`', '`pickaxe`', '`search`'].join(',\n')}`);
    if(args[0] === 'stats'){
			let amount = 0;
      client.miner.get(key, 'trolley').forEach(x => {
      	amount += x.amount;
      });
      const embed = new MessageEmbed()
      .setTitle(`${message.member.displayName}'s mining stats`)
      .setDescription(`Pick level: ${client.miner.get(key, 'pickaxe')}\nTotal pick level: ${client.miner.get(key, 'totalPickaxe')}\nMiner rank: ${client.miner.get(key, 'miner')}\nTotal miner rank: ${client.miner.get(key, 'totalMiner')}\nCurrentXP: ${client.miner.get(key, 'xp')}/${1000*client.miner.get(key, 'miner')}\nTotal XP: ${client.miner.get(key, 'totalXp')}\nItems in trolley: ${amount}\nTrolley size: ${client.miner.get(key, 'maxTrolley')}\nMining coins: ${client.miner.get(key, 'mineCoins')}\nOres mined: ${client.miner.get(key, 'oresMined')}`)

      message.channel.send(embed)
    } else if(args[0] === 'mines'){
      if(!args[1]) return message.channel.send(`Please choose one of the following options:\n\`${['list','info'].join(',\n')}\``);
      if(args[1] === 'list'){
        const embed = new MessageEmbed()
        .setTitle('The Mines')
        mines.forEach(x => {
          embed.addField(x.mine, `Required level: ${x.miner}`, true)
        });
        return message.channel.send(embed)
      } else if(args[1] === 'info'){
        if(!args[2]) return message.channel.send(`Please enter the name of the mine you wish to get information about.`)
        const mine = mines.find(x => x.mine.toLowerCase() === args.slice(2).join(' '));
        if(!mine) return message.channel.send(`${args.slice(2).join(' ')} is not a valid mine.`);
        const embed = new MessageEmbed()
        .setTitle(mine.mine)
        .setDescription(`Required miner level: ${mine.level}`)
        .setDescription(mine.ores.map(x => `Ore: ${x.name} - Pickaxe: ${x.level}`))

        return message.channel.send(embed)
      } else {
        return message.channel.send(`${args[1]} is not a valid option.`)
      };
    } else if(['current','curr','cur','show'].includes(args[0])){
      const trolley = client.miner.get(key, 'trolley').length;
      const max = client.miner.get(key, 'maxTrolley');
      const mine = mines.find(x => x.mine === client.miner.get(key, 'mine'));
      if(!mine) return message.channel.send(`You are not currently in a mine`);
      let ore = mine.ores.find(x => x.name === client.miner.get(key, 'ore'));
      if(!ore) ore = {name:'You havent found any ore yet, search the mine to find them!'}
      const embed = new MessageEmbed()
      .setTitle(mine.mine)
      .setDescription(`Required miner level: ${mine.miner}\nOre: ${ore.name}`)
      .setFooter(`Trolley ${trolley}/${max}`)

        return message.channel.send(embed)
    } else if(args[0] === 'go'){
      if(!args[1]) return message.channel.send(`Missing 3rd parameter (mine) enter which mine you would like to go to.`);
      const mine = mines.find(x => x.mine.toLowerCase() === args.slice(1).join(' '));
      if(!mine) return message.channel.send(`${args.slice(1).join(' ')} is not a valid mine`);
      if(client.miner.get(key, 'miner') < mine.miner) return message.channel.send(`You dont have a high enough mining level to enter this mine you need to have atleast mining level ${mine.miner}`);
      client.miner.set(key, mine.mine, 'mine');
      const embed = new MessageEmbed()
      .setTitle(`You have entered the ${mine.mine}`)
      .addField(`Available ores`, mine.ores.map(x => `${x.name} - Lvl ${x.level} pickaxe`))
      return message.channel.send(embed)
    } else if(args[0] === 'search'){
      if(pause.has(message.member.id)) return;
      if(search.has(message.member.id)) return message.channel.send(`You are too tired to go deeper into the mines rest a while.`)
      pause.add(message.member.id);
      client.setTimeout(() => {
        pause.delete(message.member.id);
      }, 3500);
      const mine = mines.find(x => x.mine.toLowerCase() === client.miner.get(key, 'mine').toLowerCase());
      if(!mine) return message.channel.send(`You are not in a mine and can't search for ores. Enter a mine to search.`);
      const ore = mine.ores[Math.floor(Math.random()*mine.ores.length)];
      client.miner.set(key, ore.name, 'ore')
      const embed = new MessageEmbed()
      .setTitle(`You travel deeper into the mines...`)
      .setColor('ORANGE')
      const msg = await message.channel.send(embed);
      await client.setTimeout(() => {
        const emb = msg.embeds[0];
				if(ore.level < client.miner.get(key, 'pickaxe')){
        	emb.setTitle(`You found ${ore.name.toLowerCase()} in the mines`)
        	.setDescription(`You require a pickaxe of level ${ore.level} to mine this ore, your current pickaxe level is ${client.miner.get(key, 'pickaxe')}.`)
        	.setColor('BLUE')
        	return msg.edit(emb)
				} else {
					client.miner.set(key, '', 'ore');
					emb.setTitle(`You found nothing of interest in the mines`)
					.setColor('ORANGE')
					return msg.edit(emb);
				};
      }, 5000);
      search.add(message.member.id);
      client.setTimeout(() => {
        search.delete(message.member.id);
      }, 1000 * 60 * 6-(client.stats.get(key, 'endurance') * 1000) * 30);
    } else if(args[0] === 'dig'){
      let amount = 0;
      client.miner.get(key, 'trolley').forEach(x => {
      	amount += x.amount;
      });
      if(amount >= client.miner.get(key, 'maxTrolley')) return message.channel.send(`Your trolley is full you should exit the mine to sell your ores`)
      const mine = mines.find(x => x.mine.toLowerCase() === client.miner.get(key, 'mine').toLowerCase())
      if(!mine) return message.channel.send(`Your not in a mine and cant dig`)
      const ore = mine.ores.find(x => x.name.toLowerCase() === client.miner.get(key, 'ore').toLowerCase());
      if(!ore) return message.channel.send(`You havent found any ore to mine yet search the mines for them`);
      if(client.miner.get(key, 'pickaxe') === 0) return message.channel.send(`You don't own a pickaxe, buy one to start mining.`)
      if(client.miner.get(key, 'pickaxe') < ore.level) {
        client.miner.set(key, 0, 'pickaxe');
        client.miner.set(key, '', 'ore');
        const embed = new MessageEmbed()
        .setTitle(`You mine the ${ore.name}`)
        .setDescription(`You dug the ${ore.name} but your pickaxe is too weak and breaks. You loose the ore.`)
        .setColor('RED')
        return message.channel.send(embed);
      } else {
        client.miner.inc(key, 'pickaxe');
        client.miner.set(key, '', 'ore');
        client.miner.inc(key, 'totalPickaxe');
        
        const val = {name: ore.name, amount: 1};

        if(client.miner.get(key, 'trolley').some(x => x.name === ore.name)){
          client.miner.get(key, 'trolley').forEach(x => {
            if(x.name === ore.name) x.amount++;
          });
        } else {
          client.miner.push(key, val, 'trolley');
        };

        let amount = 0;
        client.miner.get(key, 'trolley').forEach(x => {
          amount += x.amount;
        });

        const embed = new MessageEmbed()
        .setTitle(`You mine the ${ore.name}`)
        .setDescription(`You dug the ${ore.name}. You put it in your trolley.`)
        .setColor('GREEN')
        .setFooter(`Trolley ${amount}/${client.miner.get(key, 'maxTrolley')}`)
        return message.channel.send(embed);
      };
    } else if(args[0] === 'pickaxe'){
      if(!args[1]) return message.channel.send(`Select one of following options \n\`${['buy', 'stats'].join(',\n')}\``)
      if(args[1] === 'buy'){
        if(client.miner.get(key, 'pickaxe') >= 1) return message.channel.send(`You already own a pickaxe.`);
        if(client.economy.get(key, 'total') < 1000) return message.channel.send(`You can't afford a pickaxe, you need atleast $1000!`);
        let toPay = 1000;
        toPay -= client.economy.get(key, 'wallet');
        client.economy.math(key, '-', client.economy.get(key, 'wallet'), 'wallet');
        client.economy.math(key, '-', toPay, 'bank');
        client.miner.set(key, 1, 'pickaxe');
        return message.channel.send(`You have bought a pickaxe for $1000`);
      } else if(args[1] === 'stats'){
        if(client.miner.get(key, 'pickaxe') <= 0) return message.channel.send(`You don't own a pickaxe.`)
        const embed = new MessageEmbed()
        .setTitle(`Pickaxe lvl ${client.miner.get(key, 'pickaxe')}`)
        .setColor(`BLUE`)
        .addField(`Total pickaxe level`, `${client.miner.get(key, 'totalPickaxe')}`)
        return message.channel.send(embed);
      } else {
        return message.channel.send(`Please use either \`buy\` or \`stats\` option.`)
      };
    } else if(args[0] === 'exit') {
			let curAmt = 0;
			client.inventory.get(key, 'items').forEach(x => curAmt += x.amount);
			const arr = [];
			client.miner.get(key, 'trolley').forEach(x => {
				if(curAmt >= client.inventory.get(key, 'max')) return;
				curAmt += x.amount;
				arr.push(x)
				if(client.inventory.get(key, 'items').some(y => y.name === x.name)) { 
					client.inventory.get(key, 'items').forEach(y => {
						if(y.name === x.name) y.amount += x.amount;
					});
				} else {
					const val = {"name": x.name, "amount": x.amount};
        	client.inventory.push(key, val, 'items');
				};
				const bonus = (client.stats.get(key, 'mining') * 25) / 100;
				
				client.miner.math(key, '+', 1000*x.amount*bonus, 'xp');
				client.miner.math(key, '+', 1000*x.amount*bonus, 'totalXp');
				client.miner.remove(key, y => y.name === x.name, 'trolley');
			});
			let xp = client.miner.get(key, 'xp');
			let xpReq = client.miner.get(key, 'miner') * 1000;
			while(xp >= xpReq) {
				client.miner.math(key, '-', xpReq, 'xp')
				client.miner.inc(key, 'miner')
				xp -= xpReq
			};
			const embed = new MessageEmbed()
			.setTitle(`Items collected`)
			.setDescription(arr.map(x => `${x.amount}- ${x.name}`))
			.setColor('BLUE')
			return message.channel.send(embed);
    } else {
      return message.channel.send(`${args[0]} is not a valid option.`);
		};
  },
};
