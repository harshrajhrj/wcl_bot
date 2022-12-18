
/**
 * Represents a war attack
 * @member {String} attackerTag
 * @member {String} defenderTag
 * @member {Number} stars
 * @member {Number} destructionPercentage
 * @member {Number} order
 * @member {Number} duration
 */
class WarAttack{
    /**
     * @param {Object} rawWarAttckObject
     */
    constructor(rawWarAttckObject){
      this.attackerTag = rawWarAttckObject.attackerTag;
      this.defenderTag = rawWarAttckObject.defenderTag;
      this.stars = rawWarAttckObject.stars;
      this.destructionPercentage = rawWarAttckObject.destructionPercentage;
      this.order = rawWarAttckObject.order;
      this.duration = rawWarAttckObject.duration;
    }
}

module.exports.WarAttack = WarAttack;