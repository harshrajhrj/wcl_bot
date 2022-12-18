
const bu = require("./badgeUrl");
const wm = require("./warMember");

/**
 * Represent the `clan` and `opponent` object in the raw ClanWar data
 * @member {String} name
 * @member {String} tag
 * @member {BadgeUrl} badgeUrls
 * @member {Number} level
 * @member {Number} attacksUsed
 * @member {Number} stars
 * @member {Number} destructionPercentage
 * @member {WarMember[ ]} players
 */
class WarClan{
    constructor(rawClanObject){
      this.name = rawClanObject.name;
      this.tag = rawClanObject.tag;
      this.badgeUrls = new bu.BadgeUrl(rawClanObject.badgeUrls);
      this.level = rawClanObject.clanLevel;
      this.attacksUsed = rawClanObject.attacks;
      this.stars = rawClanObject.stars;
      this.destructionPercentage = rawClanObject.destructionPercentage;
      
  
      this.players = [];
      rawClanObject.members.forEach(element => {
       this.players.push(new wm.WarMember(element));
      });
    }
}

module.exports.WarClan = WarClan;