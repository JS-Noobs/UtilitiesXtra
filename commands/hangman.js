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
            if(guessed.includes(args[0])) return message.channel.send(`Letter has already been guessed.`);
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
            let string = `\`\`\`
_______
|   |
|   ${points > 0 ? 'O' : ' '}
|  ${points > 2 ? '/' : ' '}${points > 1 ? '|' : ' '}${points > 3 ? '\\' : ' '}
|  ${points > 4 ? '/' : ' '} ${points > 5 ? '\\' : ' '}
|
=======

${points > 5 ? word : `${array.join('\u200a')} -  ${word.length} letters.`}
\`\`\``;
            if(array.join('').toLowerCase() === word.toLowerCase()) {
							client.hangman.delete(key);
							let str = `\`\`\`
_______
|		|
|
| 	O
|	 \|/
|	 / \
=======

${word}
\`\`\``
							const embed = new MessageEmbed()
							.setTitle(`You won!`)
							.setDescription(str)
							return message.channel.send(embed);
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
