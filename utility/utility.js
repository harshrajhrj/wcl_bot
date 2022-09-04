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
            teamName : "",
            abb : "",
            division : ""
        };

        const fs = require("fs");
        const abbs = fs.readFileSync("./commands/abbs.json");
        const j = JSON.parse(abbs).values; // array of array with index 0 = clanTag, 1 = teamName, 2 = abb, 3 = div

        for(let element of j){
            if (element[2] == abb) {
                obj.clanTag = element[0];
                obj.teamName = element[1];
                obj.abb = element[2];
                obj.division = element[3];
                return obj;
            }
        }
        return null;
    }
}

module.exports = Utility;