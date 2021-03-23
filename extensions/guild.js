const {Structures} = require('discord.js');

Structures.extend('Guild', Guild => {
  class ExtendedGuild extends Guild {
    async fetchMember(id) {
      const snowflake = id.replace(/\D/igm, '');
      let member;
      try {
        member = this.members.fetch(snowflake)
        if(!member) return null;
      } catch(err) {
        return null
      } finally {
        return member;
      };
    };
  };
  return ExtendedGuild;
});