
/**
 * Represents the `BadgeUrls` object in the raw ClanWar data
 * @member {String} small
 * @member {String} medium
 * @member {String} large
 */
class BadgeUrl{
    constructor(rawBadgeUrlObject){
      this.small = rawBadgeUrlObject.small;
      this.medium = rawBadgeUrlObject.medium;
      this.large = rawBadgeUrlObject.large;
    }
}

module.exports.BadgeUrl = BadgeUrl;