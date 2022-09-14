/**
 * A class containing various utility functions.
 * **Note all methods are static.**
 */
class Utility{
    
    /**
     *  
     * @param {Object} object 
     * @param {String} value of the key to search for.
     * @returns {String} key
     */
    static getKeyByValue(object, value) {
        return Object.keys(object).find(key => object[key] === value);
    };


    /**
     * Get teamName, clanTag, abb, division by clan abb. 
     * @static
     * @async
     * @param {String} abb of the clan.
     * @returns {Promise<obj>} returns null if not found.
     */
     static async getClanByAbb(abb){
        var obj = {
            clanTag : "",
            clanName : "",
            teamName : "",
            abb : "",
            division : ""
        };

        const abbsSchema = require("../commands/abbSchema/registeredAbbs");
        const record = await abbsSchema.findOne({ abb : abb });
        if(!record) return null;
        
        obj.clanTag = record.clanTag;
        obj.clanName = record.clanName;
        obj.teamName = (record.teamName === "NONE") ? obj.clanName : record.teamName;
        obj.division = record.div;
        obj.abb = record.abb;
        return obj;
    }
}

module.exports = Utility;