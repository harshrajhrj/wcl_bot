/**
 * A class that contains essential resources related to WCL.
 * **Note all properties are static.**
 */
class ResourcesUtils{
    static DIVISION_ABBS = {
        'H': 'HEAVY',
        'F': 'FLIGHT',
        'E': 'ELITE',
        'B': 'BLOCKAGE',
        'CS': 'CHAMPIONS',
        'CL': 'CLASSIC',
        'L': 'LIGHT'
    };

    static DIVISION_COLOR = {
        'H': '#008dff',
        'F': '#3f1f8b',
        'E': '#a40ae7',
        'B': '#fc3902',
        'CS': '#ffb014',
        'CL': '#276cc1',
        'L': '#52d600'
    };

    static DIVISION_LOGO_URL = {
        'H': 'https://cdn.discordapp.com/attachments/995764484218028112/995764719791112252/WCL_Heavy.png?width=539&height=612',
        'F': 'https://cdn.discordapp.com/attachments/995764484218028112/995764818525044746/WCL_Flight.png?width=530&height=612',
        'E': 'https://cdn.discordapp.com/attachments/995764484218028112/995765404565782609/WCL_ELITE.png?width=514&height=612',
        'B': 'https://cdn.discordapp.com/attachments/995764484218028112/995765525001011310/WCL_Blockage-.png?width=435&height=613',
        'CS': 'https://cdn.discordapp.com/attachments/995764484218028112/995764652418023444/WCL_Champions.png?width=548&height=612',
        'L': 'https://cdn.discordapp.com/attachments/995764484218028112/995764946975596564/WCl_Light_Division-.png?width=548&height=612',
        'CL': 'https://cdn.discordapp.com/attachments/995764484218028112/995765980972195850/WCL_Classic-.png?width=548&height=612'
    };

    static WEEK_ABBS = {
        'WK1': 'WK1',
        'WK2': 'WK2',
        'WK3': 'WK3',
        'WK4': 'WK4',
        'WK5': 'WK5',
        'WK6': 'WK6',
        'WK7': 'WK7',
        'WK8': 'WK8',
        'WK9': 'WK9',
        'WK10': 'WK10',
        'WK11': 'WK11',
        'R128': 'R128',
        'R64': 'R64',
        'R32': 'R32',
        'WC': 'WC',
        'WC2': 'WC2',
        'QF': 'QF',
        'SF': 'SF',
        'F': 'F',
    }
}

module.exports = ResourcesUtils;