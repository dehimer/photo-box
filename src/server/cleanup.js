const fs = require('fs');
const path = require('path');

exports = module.exports = (imagesDirPath, photos) => {
  const imagesDirs = [{
    dirName: 'standart',
    fieldName: 'src',
  }, {
    dirName: 'thumbnail',
    fieldName: 'thumb',
  }];

  imagesDirs.map((subDir) => {
    const { dirName, fieldName } = subDir;
    const filesWhichExists = photos.map(photo => photo[fieldName]);

    const subDirPath = path.join(imagesDirPath, dirName);
    const files = fs.readdirSync(subDirPath)
      .map(fileName => ({
        name: fileName,
        time: fs.statSync(path.join(subDirPath, fileName)).mtime.getTime()
      }))
      .sort((a, b) => (a.time - b.time))
      .map(file => (file.name));

    if (photos.length < files.length) {
      files.forEach((file) => {
        if (!filesWhichExists.includes(path.join(dirName, file))) {
          const filePath = path.join(subDirPath, file);
          fs.unlink(filePath, () => {
            console.log(`Delete orphaned ${filePath} file`);
          });
        }
      });
      return files.length - photos.length;
    }

    return 0;
  });
};
