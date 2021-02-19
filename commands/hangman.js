const {MessageEmbed} = require('discord.js');
const words = require('../words.json');
module.exports = {
    name: 'hangman',
    alias: ['hm','wordguesser'],
	description: 'Start or continue a game of hangman',
    category: 'fun',
    permissions: [],
    botpermissions: [],
    development: false,
    ea: false,
	execute: async(message, args, client) => {
    const key = `${message.guild.id}-${message.member.id}`;
		
        if(client.hangman.has(key)){
            if(!args[0]) return message.channel.send(`Include your letter guess in the message!`);
            if(!isNaN(args[0])) return message.channel.send(`There is no numbers!`);
            if(args[0].length > 1) return message.channel.send(`You may only guess at letters!`);
            let word = client.hangman.get(key, 'word'), arr = client.hangman.get(key, 'array'), guessed = client.hangman.get(key, 'guessed');
		client.hmstats.ensure(client.user.id, {
			words: []
		});
		if(!client.hmstats.get(client.user.id, 'words').some(x => x.name === word))client.hmstats.push(client.user.id, {name: word, wins: 0, loose: 0}, 'words');
						if(guessed.includes(args[0])) return message.channel.send(`Letter has already been guessed.`);
						if(client.hangman.get(key, 'guessedWrong').includes(args[0])) return message.channel.send(`Letter has already been guessed.`);
            if(word.includes(args[0])) {
                for(let i=0; i<word.length; i++){
                    if(word[i].toLowerCase() === args[0]) {
                        arr[i] = args[0];
                    };
                };
                client.hangman.set(key, arr, 'array');
                client.hangman.push(key, args[0], 'guessed');
            } else {
                client.hangman.inc(key, 'points');
                client.hangman.push(key, args[0], 'guessedWrong')
            };
            
						const points = client.hangman.get(key, 'points'), array = client.hangman.get(key, 'array'), guesses = client.hangman.get(key, 'guessed'), gr = client.hangman.get(key, 'guessedWrong');
						if(array.join('').toLowerCase() === word.toLowerCase()) {
							if(client.hmstats.get(client.user.id, 'words').some(x => x.name === word)){
								client.hmstats.get(client.user.id, 'words').forEach(x => {
									if(x.name === word) x.wins++;
								});
							};
						} else if(points > 5) {
							if(client.hmstats.get(client.user.id, 'words').some(x => x.name === word)){
								client.hmstats.get(client.user.id, 'words').forEach(x => {
									if(x.name === word) x.loose++;
								});
							};
						};
						const wins = client.hmstats.get(client.user.id, 'words').find(x => x.name === word).wins;
						const losses = client.hmstats.get(client.user.id, 'words').find(x => x.name === word).loose;
						const total = wins + losses;
						const winPer = parseInt(wins / total * 100).toFixed(2);
						const losPer = parseInt(losses / total * 100).toFixed(2);
            let string = `\`\`\`
_______
|   |
|   ${points > 0 ? 'O' : ' '}
|  ${points > 2 ? '/' : ' '}${points > 1 ? '|' : ' '}${points > 3 ? '\\' : ' '}
|  ${points > 4 ? '/' : ' '} ${points > 5 ? '\\' : ' '}
|
=======

${points > 5 ? word : `${array.join('\u200a')} -  ${word.length} letters.`}
${points > 5 ? `About ${parseFloat(winPer)}% users guessed correct.` : ''}
${points > 5 ? `About ${parseFloat(losPer)}% users guessed wrong.` : ''}
${points > 5 ? `This word has been shown ${total+1} times` : ''}
\`\`\``;
					
					
					
            if(array.join('').toLowerCase() === word.toLowerCase()) {
	    let str = `\`\`\`
CONGRATS!
=========
${word.toUpperCase()}
About ${winPer}% users guessed correct.
About ${losPer}% users guessed wrong.
This word has been shown ${total} times.
\`\`\``
							const embed = new MessageEmbed()
							.setTitle(`You beat the executioner!`)
							.setDescription(str)
							message.channel.send(embed);
		    					return client.hangman.delete(key);
						};
            const embed = new MessageEmbed()
            .setTitle(points > 5 ? `You loose!` : `${message.member.displayName}'s hangman`)
            .setDescription(string)
						.addField('Right guesses', `\`\`\`\u200b${guesses.join(', ')}\`\`\``)
						.addField('Wrong guesses', `\`\`\`\u200b${gr.join(', ')}\`\`\``)
						if(points > 5) client.hangman.delete(key)
            return message.channel.send(embed);
        } else {
            const word = words[Math.floor(Math.random() * words.length)];
            const array = new Array(word.length).fill('_');
            client.hangman.ensure(key, {
                points: 0,
                word: word,
                array: array,
                guessed: [],
								guessedWrong: []
            });
            const points = client.hangman.get(key, 'points');
            const string = `\`\`\`
_______
|   |
|   ${points > 0 ? 'O' : ' '}
|  ${points > 2 ? '/' : ' '}${points > 1 ? '|' : ' '}${points > 3 ? '\\' : ' '}
|  ${points > 4 ? '/' : ' '}${points > 5 ? '\\' : ' '}
|
=======

${array.join('\u200a')} - ${word.length} letters.
 \`\`\``;

            const embed = new MessageEmbed()
            .setTitle(`${message.member.displayName}'s hangman`)
            .setDescription(string)
            .setFooter(`You can guess a letter by using "<prefix>hangman <letter>"`)

            return message.channel.send(embed);
        };
    },
};
