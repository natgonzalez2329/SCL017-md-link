const { mdlinksFinder, isFolder, folderReader, isFile, fileReader, statsLinks, linkSearcher } = require('../mdLinks');

describe('mdLinks Tests', () => {

  it('isFile String False', () => {
    const fullPath = 'asd';
    const result = isFile(fullPath);
    expect(result).toBeFalsy();
  });

  it('isFile String true', () => {
    const fullPath = 'asd.MD';
    const result = isFile(fullPath);
    expect(result).toBeTruthy();
  });

  it('isFile Object true', () => {
    const fullPath = {};
    const result = isFile(fullPath);
    expect(result).toBeTruthy();
  });

  it('isFolder true', () => {
    const fullPath = './';
    const result = isFolder(fullPath);
    expect(result).toBeTruthy();
  });

  it('isFolder false', () => {
    const fullPath = './asd/';
    const result = isFolder(fullPath);
    expect(result).toBeFalsy();
  });
  
  it('folderReader Resolve', () => {
    expect.assertions(1);
    const fullPath = './';
    return expect(folderReader(fullPath)).resolves.toEqual(['README.md']);
  });
  
 /*  it('folderReader Reject', () => {
    const fullPath = '.coverage';
    expect(folderReader(fullPath)).rejects.toMatchObject({ code:'ENOENT' });
  }); */

});

