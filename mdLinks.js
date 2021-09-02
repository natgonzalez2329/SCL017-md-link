const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios');

const isFolder = (fullPath) => {
    try {
        const pathExists = fs.statSync(fullPath);
        return pathExists && pathExists.isDirectory();
    } catch (e) {
        return false;
    }
};

const folderReader = (pathFolder) => {
  return new Promise((resolve, reject) => {
      fs.readdir(pathFolder, (error, files) => {
          if (error) {
              reject(error);
          }
          if (files.length > 0) {
              const filesMd = files.filter((file) => path.extname(file.toLowerCase()) === '.md');
              resolve(filesMd);
          }
      });
  });
};

const isFile = (fullPath) => {
    let result = false;
    if (typeof fullPath === 'object') {
        result = true;
    } else if (typeof fullPath === 'string') {
        result = path.extname(fullPath).toLowerCase() === '.md'
    }
    return result;
};

const fileReader = (pathFile) => {
  return new Promise((resolve, reject) => {
      fs.readFile(pathFile, 'utf8', (err, data) => {
          if (err) {
              reject(err);
          }
          resolve(data);
      });
  });
};

const statsLinks = (links) => {
  const totalLinks = links.length;
  const uniqueLinks = [...new Set(links.map((allLinks) => allLinks.href))].length;
  const brokenLinks = links.filter((linkData) => linkData.ok === 'fail').length;
  const statData = { total: totalLinks, unique: uniqueLinks };
  if(brokenLinks > 0) {
    statData['broken'] = brokenLinks;
  };
  return statData;
};

const linkSearcher = (dataFile, options, filePath) => {
  return new Promise((resolve, reject) => {
      try {
          const links = markdownLinkExtractor(dataFile, true).filter(link => link.href.includes('https://') || link.href.includes('http://'));
          const linksData = links.map(link => ({ href: link.href, text: link.text, file: filePath }));
          if (options.validate) {
            resolve(Promise.all(linksData.map(linkData => {
              return axios.get(linkData.href).then((response) => {
                  linkData.status = response.status;
                  if (response.status === 200) {
                      linkData.ok = response.statusText;
                  }
                  return linkData;
              }).catch(error => {
                  linkData.status = error.response.status;
                  linkData.ok = 'fail';
                  return linkData;
              });
          })));
          } else {
              resolve(linksData)
          };
      } catch (error) {
          reject(error)
      }
  });
};

const mdlinksFinder = (fullPath, options = { validate: false, stats: false }) => {
    return new Promise((resolve, reject) => {
        try {
            if (isFile(fullPath)) {
                let pathArray = [];
                if (typeof fullPath !== 'object') {
                    pathArray.push(fullPath);
                } else {
                    pathArray = fullPath;
                }
                pathArray.forEach((path) => {
                    fileReader(path, options).then(fileData => {
                        linkSearcher(fileData, options, path).then(linksData => {
                          if (options.validate && !options.stats) {
                            resolve(linksData);                           
                          } 
                          if(options.stats && !options.validate) {
                            const stats = statsLinks(linksData);
                          resolve(stats);
                          } 
                          if(options.validate && options.stats) {
                          const stats = statsLinks(linksData);
                            resolve(stats);
                          } 
                            resolve(linksData);
                        }).catch(e => console.log(e));
                    }).catch(e => console.log(e))
                })
            } else if (isFolder(fullPath)) {
                folderReader(fullPath, options).then(fileData => {
                  const pathJoin = path.join(`${fullPath}${path.sep}${fileData}`);
                    resolve(mdlinksFinder(pathJoin, options));
                }).catch(e => console.log(e));
            }
        } catch (error) {
            reject(error);
        }
    });
};
/* mdlinksFinder('./README.md', { validate: true, stats: true }).then(r => console.log(r)).catch(e => console.log(e)); */

module.exports = {
    mdlinksFinder,
    isFolder,
    folderReader,
    isFile,
    fileReader,
    statsLinks,
    linkSearcher,
};
