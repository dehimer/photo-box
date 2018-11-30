const hound = require('hound');
const gm = require('gm');
const fs = require('fs');

const processPhoto = (file, sConfig, crop, cb) => {
  const date = new Date();

  const photoId = sConfig.label + (sConfig.lastNum % config.imagesPerPage + 1),
    photoDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`,
    shortName = `${photoDate}-${photoId}`,
    photoName = `${__dirname}/images/standart/${shortName}.jpg`,
    thumbName = `${__dirname}/images/thumbnail/${shortName}.jpg`;

  const img = gm(file);

  const c = crop || sConfig.crop;
  if (c) {
    img.crop(c.width, c.height, c.x, c.y);
  }

  if (sConfig.level) {
    img.level(sConfig.level.black, sConfig.level.gamma, sConfig.level.white);
  }

  if (sConfig.modulate) {
    img.modulate(sConfig.modulate.b, sConfig.modulate.s, sConfig.modulate.h);
  }

  if (sConfig.frame) {
    img.resize(sConfig.frameWidth, sConfig.frameHeight, '!')
      .draw([`image Over 0,0 0,0 ${sConfig.frame}`])
  }

  sConfig.lastNum++;

  // Создаем картинку

  img.quality(100).write(photoName, function() {
    console.log(`Frame applyed to ' + ${photoName}`);

    // Создаем превью

    gm(photoName)
      .resize(config.thumbnail.width, config.thumbnail.height, '!')
      .quality(100)
      .write(thumbName, function() {
        console.log('Миниатюра ' + thumbName + ' создана');

        // Пишем в базу
        dbPhoto.insert({
          name: shortName,
          label: sConfig.label,
          path: file,
          src: `standart/${photoName.split("/").pop()}`,
          thumb: `thumbnail/${photoName.split("/").pop()}`,
          display: true,
          date: date,
          id: photoId
        }, function (err, newDoc) {
          io.emit('new', [newDoc]);
          if (cb) cb(newDoc);
        });
      });
  });
};


module.exports = (cb) => {
  // DIRS
  const dirs = ['images/', 'images/standart', 'images/thumbnail'];
  const sources = config.sources.map((oldSource) => {
    const source = { ...oldSource };
    dirs.push(source.watchpath);

    if (source.frame) {
      gm(source.frame).size((err, value) => {
        if (err) return;

        source.frameWidth = value.width;
        source.frameHeight = value.height;
      });
    }

    dbPhotos.count({ label: source.label }, (err, count) => {
      source.lastNum = count;
    });

    return source;
  });

  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });



  config.sources.forEach((source) => {
    let photoWatcher;

    // На сетевых дисках когда много файлов fs.watch начинает падать с ошибкой
    if (config.useWatchFile) {
      photoWatcher = hound.watch(source.watchpath, {
        watchFn: fs.watchFile
      });
    } else {
      photoWatcher = hound.watch(source.watchpath);
    }
    console.log(`Watch photo files in ${source.watchpath}`);

    photoWatcher.on('create', (file) => {
      console.log(`Found new photo ${file}`);
      setTimeout(() => {
        if (source.special) {
          processPhoto(file, source, null, syncPhotos);
          processPhoto(file, source, source.crop2, (procesedPhoto) => {
            if (config.deleteAfterImport) {
              fs.unlink(file, () => {
                console.log(`Source file ${file} is deleted`);
              });
            }
            syncPhotos(procesedPhoto);
          });
        } else {
          processPhoto(file, source, null, (procesedPhoto) => {
            if (config.deleteAfterImport) {
              fs.unlink(file, () => {
                console.log(`Source file ${file} is deleted`);
              });
            }
            syncPhotos(procesedPhoto);
          });
        }
      }, 3000);
    });
  });

};
