
const wa = require("./warAttack");

/**
 * Represents a war member i.e a player/village
 * @member {String} tag
 * @member {String} name
 * @member {Number} townhallLevel
 * @member {WarAttack[ ] | [ ]} attacks
 * @member {Number} numberOfOpponentAttacks
 * @member {WarAttack | null} bestOpponentAttack
 */
class WarMember{
    /**
     * 
     * @param {Object} rawMemberObject raw war member object
     */
    constructor(rawMemberObject){
        this.setAttributes(rawMemberObject)
    }

    /**
     * @private
     */
    setAttributes(rawMemberObject){
        this.tag = rawMemberObject.tag;
        this.name = rawMemberObject.name;
        this.townhallLevel = rawMemberObject.townhallLevel;
        this.mapPosition = rawMemberObject.mapPosition;
        
        this.attacks = [];
        //if a player didn't use their attack, there will be no `.attacks` object in response.
        //checking if the player used their attack.
        if(rawMemberObject.attacks){
          rawMemberObject.attacks.forEach(element => {
            this.attacks.push(new wa.WarAttack(element));
          });
        }
        
        this.numberOfOpponentAttacks = rawMemberObject.opponentAttacks;
        this.bestOpponentAttack = rawMemberObject.bestOpponentAttack ? new wa.WarAttack(rawMemberObject.bestOpponentAttack) : null;
    }
}

module.exports.WarMember = WarMember;