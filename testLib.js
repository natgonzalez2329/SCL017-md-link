const mdlinks = require('./index.js');

mdlinks('./README.md', { validate: true }).then(r => console.log(r)).catch(e => console.log(e));