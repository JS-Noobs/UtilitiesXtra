const {Structures} = require('discord.js');

Structures.extend('TextChannel', TextChannel => {
  class ExtendedTextChannel extends TextChannel {
    async send(message) {
      super.send(message).catch(err => {
        return console.error(err);
      });
    };
  };
  return ExtendedTextChannel
});

Structures.extend('NewsChannel', NewsChannel => {
  class ExtendedNewsChannel extends NewsChannel {
    async send(message) {
      super.send(message).catch(err => {
        return console.error(err);
      });
    };
  };
  return ExtendedNewsChannel
});