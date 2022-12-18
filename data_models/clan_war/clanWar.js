
const wm = require("./warMember");
const wc = require("./warClan");

/**
 * Represent a clan war
 * @member {String} state
 * @member {Number} teamSize
 * @member {Number} attacksPerMember
 * @member {ISODataTime} preparationStartTime
 * @member {ISODataTime} startTime
 * @member {ISODataTime} endTime
 * @member {WarClan} clan
 * @member {WarClan} opponent
 */
class ClanWar{

    /**
     * 
     * @param {Object} rawClanWarObject 
     */
    constructor(rawClanWarObject){
      this.state = rawClanWarObject.state;
      this.teamSize = rawClanWarObject.teamSize;
      this.attacksPerMember = rawClanWarObject.attacksPerMember;
      this.preparationStartTime = rawClanWarObject.preparationStartTime;
      this.startTime = rawClanWarObject.startTime;
      this.endTime = rawClanWarObject.endTime;
      this.clan = new wc.WarClan(rawClanWarObject.clan);
      this.opponent = new wc.WarClan(rawClanWarObject.opponent);
    }
}

module.exports.ClanWar = ClanWar;