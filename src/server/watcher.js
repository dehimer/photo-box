/* eslint-disable no-underscore-dangle */
const hound = require('hound');
const gm = require('gm');
const fs = require('fs');


const sourcesLastNumByLabel = {};

const processPhoto = (params, cb) => {
  const {
    file,
    source,
    useSecondCrop,
    thumbnail,
    imagesPerPage,
    can
  } = params;

  const date = new Date();

  const photoLabel = source.label + ((source.lastNum % imagesPerPage) + 1);
  const photoDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}`;
  const shortName = `${photoDate}-${photoLabel}`;
  const photoName = `${__dirname}/images/standart/${shortName}.jpg`;
  const thumbName = `${__dirname}/images/thumbnail/${shortName}.jpg`;

  const image = gm(file);

  const crop = useSecondCrop ? source.crop2 : source.crop;
  if (crop) {
    image.crop(crop.width, crop.height, crop.x, crop.y);
  }

  if (source.level) {
    image.level(source.level.black, source.level.gamma, source.level.white);
  }

  if (source.modulate) {
    image.modulate(source.modulate.b, source.modulate.s, source.modulate.h);
  }

  if (source.frame) {
    image.resize(source.frameWidth, source.frameHeight, '!')
      .draw([`image Over 0,0 0,0 ${source.frame}`]);
  }

  sourcesLastNumByLabel[source.label] += 1;

  // Создаем картинку

  image.quality(100).write(photoName, () => {
    console.log(`Frame applyed to ' + ${photoName}`);

    // Создаем превью

    gm(photoName)
      .resize(thumbnail.width, thumbnail.height, '!')
      .quality(100)
      .write(thumbName, () => {
        console.log(`Миниатюра ${thumbName} создана`);

        can.emit('photo:new', {
          name: shortName,
          label: source.label,
          path: file,
          src: `standart/${photoName.split('/').pop()}`,
          thumb: `thumbnail/${photoName.split('/').pop()}`,
          display: true,
          date,
          id: photoLabel
        });

        if (cb) cb();
      });
  });
};


module.exports = (config, photos, can) => {
  // DIRS
  const dirs = ['images/', 'images/standart', 'images/thumbnail'];
  const sources = config.sources.map((rowSource) => {
    const source = { ...rowSource };
    dirs.push(source.watchpath);

    if (source.frame) {
      gm(source.frame).size((err, sizes) => {
        if (err) return;

        source.frameWidth = sizes.width;
        source.frameHeight = sizes.height;
      });
    }

    photos.count({ label: source.label }, (err, count) => {
      sourcesLastNumByLabel[source.label] = count;
    });

    return source;
  });

  // create images directories is not exists
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });


  sources.forEach((source) => {
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
        const { thumbnail, imagesPerPage } = config;
        const defaultOptions = {
          file,
          source,
          thumbnail,
          imagesPerPage,
          can
        };

        if (source.special) {
          processPhoto(defaultOptions);
          processPhoto({
            ...defaultOptions,
            useSecondCrop: true,
          }, (procesedPhoto) => {
            if (config.deleteAfterImport) {
              fs.unlink(file, () => {
                console.log(`Source file ${file} is deleted`);
              });
            }
            can('photo:send', procesedPhoto);
          });
        } else {
          processPhoto(defaultOptions, (procesedPhoto) => {
            if (config.deleteAfterImport) {
              fs.unlink(file, () => {
                console.log(`Source file ${file} is deleted`);
              });
            }
            can('photo:send', procesedPhoto);
          });
        }
      }, 3000);
    });
  });
};
