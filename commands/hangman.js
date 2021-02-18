const {MessageEmbed} = require('discord.js');
const words = require('../words.json');
module.exports = {
    name: 'hangman',
    alias: [],
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
                client.hangman.push(key, args[0], 'guessed')
            };
            const points = client.hangman.get(key, 'points'), array = client.hangman.get(key, 'array'), guesses = client.hangman.get(key, 'guessed');
            let string = `\`\`\`
_______
|   |
|   ${points > 0 ? 'O' : ' '}
|  ${points > 2 ? '/' : ' '}${points > 1 ? '|' : ' '}${points > 3 ? '\\' : ' '}
|  ${points > 4 ? '/' : ' '}${points > 5 ? '\\' : ' '}
|
=======

${array.join('')} - ${word.length} letters.
${guesses.join(', '}
\`\`\``;
            if(array.join('').toLowerCase() === word.toLowerCase()) return message.channel.send(`You won! The word was ${word}`);
            const embed = new MessageEmbed()
            .setTitle(`${message.member.displayName}'s hangman`)
            .setDescription(string)
            if(points > 5) {
                embed.addField(`You loose!`, `The word was ${word}`);
                client.hangman.delete(key);
            };

            return message.channel.send(embed);
        } else {
            const word = words[Math.floor(Math.random() * words.length)];
            const array = new Array(word.length).fill('_');
            client.hangman.ensure(key, {
                points: 0,
                word: word,
                array: array,
                guessed: []
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

${array.join('')}
 \`\`\``;

            const embed = new MessageEmbed()
            .setTitle(`${message.member.displayName}'s hangman`)
            .setDescription(string)
            .setFooter(`You can guess a letter by using "<prefix>hangman <letter>"`)

            return message.channel.send(embed);
        };
    },
};
