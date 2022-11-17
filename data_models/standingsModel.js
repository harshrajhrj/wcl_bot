/**
 *  A class to represent a clan's records.
 */
class ClanModel {

    /**
     * 
     * @param {Object} clanRecordObject Object of per raw clan record/result data
     */
    constructor(clanRecordObject) {
        this.abb = clanRecordObject.abb;
        this.clanTag = clanRecordObject.clanTag;
        this.conference = clanRecordObject.conference;
        this.opponents = clanRecordObject.opponent;
        this.wins = 0;
        this.loses = 0;
        this.ties = 0;
        this.perDest = 0;
        this.matchesPlayed = 0;
        this.starsFor = 0;
        this.starsAgainst = 0;
        this.averageSD = 0;
        this.averagePerDest = 0;
        this.setStats(this.opponents);
    }

    /**
     * Sets values of all properties.
     * @private
     * @param {Object} opponentObject Opponent Object
     */
    setStats(opponentObject) {
        for (let opponent of Object.values(opponentObject)) {
            (opponent.status === "W") ? this.wins++ : null;
            (opponent.status === "L") ? this.loses++ : null;
            (opponent.status === "T") ? this.ties++ : null;


            //if opponent.status is UNDECLARED means war hasn't been played yet, thus it won't get added to matchesPlayed count
            // opponent.starFor !== 0 to ensure that it is not a forfeit war. since it won't be counted towards Average Star Differential
            if (opponent.status !== "UNDECLARED" && opponent.starFor !== 0) {
                this.matchesPlayed++;
                this.starsFor += opponent.starFor;
                this.starsAgainst += opponent.starAgainst;
                this.perDest += opponent.perDest;
            }
        }

        if (this.matchesPlayed > 0) {
            this.averageSD = (this.starsFor - this.starsAgainst) / this.matchesPlayed;
            this.averagePerDest = this.perDest / this.matchesPlayed;
        }
    }

    /**
     * Get opponent of a particular week of the clan.
     * @async
     * @param {String} week Ex: `WK1` 
     * @return {returnType}
     */
    async getOpponent(week) {
        var returnType = {
            abb: "",
            clanTag: "",
            status: "W/L/T/UNDECLARED",
            starFor: 0,
            starAgainst: 0,
            perDest: 0,
            warID: 0,
            deleteHistory: ""
        }
        return this.opponents[week];
    }
}


/**
 * A class to represent a Array of Clan
 */
class StandingsModel {

    /**
     * **Sorts Array of Object based on the WCL Standings/Ranking criteria.**
     * @static
     * @async
     * @param {Object[]} rawClanRecords Unsorted Array of raw clan records/results data.
     * example: [
     *          {
     *              abb: "AOW",
     *              clanTag: "#RYRQU2UG",
     *              opponent: {
     *                          WK1: {
     *                                  abb: "CU",
     *                                  clanTag: "#V8YCJJ9G",
     *                                  status: "W",
     *                                  starFor: 14,
     *                                  starAgainst: 11,
     *                                  perDest: 90.11
     *                          },    
     *              },
     *              conference: "ARCHER"
     *          }
     *      ]
     * @return {Promise<ClanModel[]>} Sorted Array of Clan(based on the standings sort criteria)
     */
    static async sort(rawClanRecords) {
        var clanObjectsArray = []
        for (let clanRecord of rawClanRecords) {
            //converting raw clanRecord into Clan object and storing in a array. 
            clanObjectsArray.push(new ClanModel(clanRecord));
        }

        return await this.prototype.standingsSort(clanObjectsArray);
    }

    /**
     * sort array of ClanModel based on the WCL Standings/ranking criteria.
     * @private
     * @async
     * @param {ClanModel[]} clansArray Array of Clan.
     * @return {Promise<ClanModel[]>} Sorted Array of Clan.
     */
    async standingsSort(clansArray) {
        return clansArray.sort((a, b) => {
            //sorts in the following order: wins > ties > loses > average star differential > average destruction percentage
            return ((b.wins + b.ties / 2) - (a.wins + a.ties / 2) || b.averageSD - a.averageSD || b.averagePerDest - a.averagePerDest);
        });
    }
}

module.exports.StandingsModel = StandingsModel;
module.exports.ClanModel = ClanModel;