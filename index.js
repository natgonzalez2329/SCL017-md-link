const mdlinksFinder = require('./mdLinks.js');
const path = require('path');

if (require.main === module) {
    if (process.argv.length > 2) {
        const fullPath = path.resolve(process.argv[2]);
        mdlinksFinder(fullPath, { validate: process.argv[3] === '--validate' || process.argv[4] === '--validate' ? true : false, stats: process.argv[3] === '--stats' || process.argv[4] === '--stats' ? true : false }).then(r => console.log(r)).catch(e => console.log(e))
    } else {
        console.log('Usage: node . "path to file"', '\n', 'also can add a second param "--validate": to validate the links in the md file')
    }
}
// mdlinksFinder('./README.md', { validate: true }).then(r => console.log(r)).catch(e => console.log(e));
// mdlinksFinder('./', { validate: true }).then(r => console.log(r)).catch(e => console.log(e));
// console.log(path.resolve(process.argv[2]))
// console.log(process.argv)
//console.log(require.main)
// mdlinksFinder('C:\Users\Natasha Gonzalez\Desktop\SCL017-md-link\files', { validate: true });

module.exports = mdlinksFinder;
