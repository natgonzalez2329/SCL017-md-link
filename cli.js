#!/usr/bin/env node
const { mdlinksFinder } = require('./mdLinks.js');
const path = require('path');
const chalk = require('chalk');

if (process.argv.length > 2) {
  const fullPath = path.resolve(process.argv[2]);
  mdlinksFinder(fullPath, { 
      validate: process.argv[3] === '--validate' || process.argv[4] === '--validate' ? true : false,
      stats: process.argv[3] === '--stats' || process.argv[4] === '--stats' ? true : false 
  }).then(r => {
      if (process.argv[3] === '--stats' || process.argv[4] === '--stats') {
          console.log(chalk.green(`Total: ${r.total}`));
          console.log(chalk.green(`Unique: ${r.unique}`));
          if (r.broken) {
              console.log(chalk.red(`Broken: ${r.broken}`));
          }
      } else {
          r.forEach(element => {
              if (element.ok === 'fail') {
                  console.log(chalk.redBright(require('util').inspect(element)));
              } else {
                  console.log(chalk.greenBright(require('util').inspect(element)));
              }
          });
      }
  })
  .catch(e => console.log(chalk.red(e.message)))
} else {
  console.log('Usage:  mdlink-validator <path to file>', '\n', 'also can add a second param "--validate": to validate the links in the md file or "--stats": to show links\' stats');
}