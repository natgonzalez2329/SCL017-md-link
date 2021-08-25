const marked = require('marked');
const fs = require('fs');
const path = require('path');
// const dirPath = path.resolve(process.argv[2]);
// const fileExtension = path.extname(dirPath);

const dirReader = (dirPath) => {
  const files = fs.readdirSync(dirPath);
  const filesArray = [];
  if (!files) {
    console.log('errrrororororororororororo: ' + files)
  }
  files.forEach((file) => {
    if (path.extname(file) === '.md' || path.extname(file) === '.MD') {
      filesArray.push(file)
    }
  });
  return filesArray;
}
const fileReader = (dirPath, options) => {
  let dataFile = [];
  dirPath.forEach((file) => {
    if (path.extname(file) === '.md' || path.extname(file) === '.MD') {
      const data = fs.readFileSync(file, 'utf8');
      if (!data) {
        throw new Error('there is no data');
      }
     const result = marked.lexer(data);
     result.forEach(token => {
      // console.log(token)
      if (token && token.text) {
        const t = token.text;
        if (t.includes('https://') || t.includes('http://')) {
          console.log(t)
        }
      }
     })
      // dataFile.push(file);
    }
  });
  return dataFile;
}


const linkSearcher = (pathFile, options = { validate: false }) => {
  let fpath = [];
  try {
    if (fs.lstatSync(pathFile).isDirectory()) {
      console.log('es carpetaaaaaaaaa')
      dirReader(pathFile).forEach((fp) => {
        fpath.push(fp);
      });
    } else {
      fpath.push(pathFile);
    }
    const fileData = fileReader(fpath, options);
    console.log(fileData)
  } catch (error) {
    console.log(error)
  }
}






/* dirReader(dirPath)
  .then(files => {
    files.forEach(file => {
      if (path.extname(file) === '.md') {
        fs.readFile(file);
        console.log(file);
      }
    });
  }).catch(error => console.log(error)); */





/* fs.readdir("./files", (error, files) => {
  if (error) {
    console.log(error);
  }
  console.log(files);
})
 
fs.readFile("./files/README-test.md", (error, file) => {
  if (error) {
    console.log(error.message);
  }
  console.log(file);
}) */


/* module.exports = () => {
  // ...
}; */
/* 
mdLinks("./some/example.md")
.then(links => {
  // => [{ href, text, file }, ...]
})
.catch(console.error);

mdLinks("./some/example.md", { validate: true })
.then(links => {
  // => [{ href, text, file, status, ok }, ...]
})
.catch(console.error);

mdLinks("./some/dir")
.then(links => {
  // => [{ href, text, file }, ...]
})
.catch(console.error); */
linkSearcher('./');
// linkSearcher('C:/Users/Antoniojose Figueroa/Desktop/SCL017-md-link/SCL017-md-link/README.md');
// linkSearcher('./README.md');

module.exports = linkSearcher;