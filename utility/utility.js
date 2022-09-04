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
}

module.exports = Utility;