/* eslint-disable no-underscore-dangle */
const hound = require('hound');
const gm = require('gm');
const fs = require('fs');


const sourcesLastNumByLabel = {
};

function prepareSources(config, photosDB) {
  const dirs = ['images/', 'images/standart', 'images/thumbnail'];

  // create images directories is not exists
  dirs.forEach((dir) => {
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir);
    }
  });

  return config.sources.map((rowSource) => {
    const source = {
      ...rowSource
    };

    dirs.push(source.watchpath);

    if (source.frame) {
      gm(source.frame).size((err, sizes) => {
        if (err) return;

        source.frameWidth = sizes.width;
        source.frameHeight = sizes.height;
      });
    }

    photosDB.find({
      label: source.label
    }).sort({
      date: -1
    }).limit(1).exec((err, photos) => {
      if (err) throw new Error(err);

      if (photos && photos.length === 1) {
        const photo = photos[0];
        sourcesLastNumByLabel[source.label] = parseInt(photo.id.replace(source.label, ''), 10) + 1;
      } else {
        sourcesLastNumByLabel[source.label] = 0;
      }

      sourcesLastNumByLabel[source.label] %= config.imagesPerPage;
    });

    return source;
  });
}

function processPhoto(params, cb) {
  // console.log('processPhoto');
  // console.log(params);
  const {
    file,
    source,
    useSecondCrop,
    thumbnail,
    imagesPerPage,
    can,
    imagesDirPath
  } = params;

  const date = new Date();

  sourcesLastNumByLabel[source.label] = (sourcesLastNumByLabel[source.label] + 1) % imagesPerPage;

  const photoLabel = source.label + sourcesLastNumByLabel[source.label];
  console.log(`+ID: ${photoLabel}`);
  const photoDate = `${date.getFullYear()}-${(date.getMonth() + 1)}-${date.getDate()}-${date.getHours()}-${date.getMinutes()}-${date.getSeconds()}-${date.getMilliseconds()}`;
  const shortName = `${photoDate}-${photoLabel}`;
  const photoName = `${imagesDirPath}/standart/${shortName}.jpg`;
  const thumbName = `${imagesDirPath}/thumbnail/${shortName}.jpg`;

  const image = gm(file);

  const crop = useSecondCrop ? source.crop2 : source.crop;
  console.log(`crop ${useSecondCrop}`);
  console.log(crop);
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

  // Создаем картинку
  image.quality(100).write(photoName, () => {
    console.log(`Frame applyed to ' + ${photoName}`);

    // Создаем превью
    gm(photoName)
      .resize(thumbnail.width, thumbnail.height, '!')
      .quality(100)
      .write(thumbName, () => {
        console.log(`Миниатюра ${thumbName} создана`);
        const photo = {
          name: shortName,
          label: source.label,
          path: file,
          src: `standart/${photoName.split('/').pop()}`,
          thumb: `thumbnail/${photoName.split('/').pop()}`,
          display: true,
          date,
          id: photoLabel
        };

        can.emit('photo:new', photo, (data) => {
          if (cb) cb(data);
        });
      });
  });
}


function createWatchers(sources, config, prevWatchers, can) {
  for (const watcher of prevWatchers) {
    watcher.clear();
  }

  return sources.map((source) => {
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
          can,
          imagesDirPath: config.imagesDirPath
        };

        if (source.special) {
          processPhoto(defaultOptions, (procesedPhoto) => {
            console.log('procesedPhoto');
            can.emit('photo:upload', procesedPhoto);

            processPhoto({
              ...defaultOptions,
              useSecondCrop: true,
            }, (procesedPhoto1) => {
              console.log('procesedPhoto1');
              console.log(procesedPhoto1);
              if (config.deleteAfterImport) {
                fs.unlink(file, () => {
                  console.log(`Source file ${file} is deleted`);
                });
              }
              can.emit('photo:upload', procesedPhoto1);
            });
          });
        } else {
          processPhoto(defaultOptions, (procesedPhoto) => {
            console.log('procesedPhoto2');
            console.log(procesedPhoto);
            if (config.deleteAfterImport) {
              fs.unlink(file, () => {
                console.log(`Source file ${file} is deleted`);
              });
            }
            can.emit('photo:upload', procesedPhoto);
          });
        }
      }, 3000);
    });

    return photoWatcher;
  });
}


module.exports = async (config, imagesDirPath, photos, can) => {

  let sources = [];
  let watchers = [];

  Object.assign(config, { imagesDirPath });

  sources = prepareSources(config, photos);
  watchers = createWatchers(sources, config, watchers, can);

  can.on('config:updated', (newConfig) => {
    console.log('config:updated');
    console.log(newConfig.sources);
    Object.assign(newConfig, { imagesDirPath });
    // Object.assign(config, data);

    sources = prepareSources(newConfig, photos);
    watchers = createWatchers(sources, newConfig, watchers, can);
  });
};
