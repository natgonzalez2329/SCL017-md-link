const fs = require('fs');
const path = require('path');
const markdownLinkExtractor = require('markdown-link-extractor');
const axios = require('axios');

const fileReader = (pathFile) => {
    return new Promise((resolve, reject) => {
        fs.readFile(pathFile, 'utf8', (err, data) => {
            if (err) {
                reject(err);
            }
            resolve(data);
        });
    });
}

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
}

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
}

const isFolder = (fullPath) => {
    const pathExists = fs.statSync(fullPath);
    return pathExists && pathExists.isDirectory();
}
const isFile = (fullPath) => {
    let result = false;
    if (typeof fullPath === 'object') {
        result = true;
    } else if (typeof fullPath === 'string') {
        result = path.extname(fullPath).toLowerCase() === '.md'
    }
    return result;
}

const mdlinksFinder = (fullPath, options = { validate: false }) => {
    return new Promise((resolve, reject) => {
        try {
            if (isFile(fullPath)) {
                console.log('its a fileeeeeeeee');
                let pathArray = [];
                if (typeof fullPath !== 'object') {
                    pathArray.push(fullPath);
                } else {
                    pathArray = fullPath;
                }
                pathArray.forEach((path) => {
                    fileReader(path, options).then(fileData => {
                        linkSearcher(fileData, options, path).then(linksData => {
                            resolve(linksData);
                        }).catch(e => console.log(e));
                    }).catch(e => console.log(e))
                })
            } else if (isFolder(fullPath)) {
                console.log('its a folder');
                folderReader(fullPath, options).then(fileData => {
                    resolve(mdlinksFinder(fileData, options));
                }).catch(e => console.log(e));
            }
        } catch (error) {
            reject(error);
        }
    });
}

module.exports = mdlinksFinder;
