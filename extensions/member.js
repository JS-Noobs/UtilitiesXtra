const {Structures} = require('discord.js');

Structures.extend('GuildMember', GuildMember => {
  class ExtendedMember extends GuildMember {
    async roleHigher(member) {
      if(member.roles.highest.position >= this.roles.highest.position) return true;
      else return false;
    };

    async send(message) {
      const msg = await super.send(message).catch(err => {
        return console.error(err.message);
      });
    };

    async kick(reason) {
      this.kick(reason).catch(err => {
        return console.error(err);
      });
    };

    async ban(reason) {
      this.kick(reason).catch(err => {
        return console.error(err);
      });
    };
  };
  return ExtendedMember
});