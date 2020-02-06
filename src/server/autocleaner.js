const fs = require('fs');
const path = require('path');

module.exports = (config, photos, can) => {
  const {
    imagesDirPath,
    deleteOverflowed,
    imagesPerPage,
    deleteOutdated,
    daysToDelete,
    hoursOfDeleteCheck = 2,
  } = config;

  const removePhoto = (photo, reason) => {
    console.log('removePhoto');
    console.log(photo);
    // remove files of photo
    console.log(`Gonna be deleted ${path.join(imagesDirPath, photo.src)}`);
    fs.unlink(path.join(imagesDirPath, photo.src), (err) => {
      if (err) console.error(err);
      console.log(`File ${photo.src} is deleted (${reason})`);
    });

    console.log(`Gonna be deleted ${path.join(imagesDirPath, photo.thumb)}`);
    fs.unlink(path.join(imagesDirPath, photo.thumb), (err) => {
      if (err) console.error(err);
      console.log(`File ${photo.thumb} is deleted (${reason})`);
    });
  };

  // remove by overflow
  if (deleteOverflowed) {
    const cleanOld = () => {
      console.log('cleanOld');
      photos.count({}, (countErr, photosCount) => {
        if (countErr) throw new Error(countErr);

        console.log(`imagesPerPage: ${imagesPerPage}`);
        console.log(`photosCount: ${photosCount}`);

        if (photosCount > imagesPerPage) {
          photos.find({}).sort({ date: -1 }).skip(imagesPerPage).exec((findErr, photosOverflow) => {
            if (findErr) throw new Error(findErr);

            console.log(`photosOverflow (${photosOverflow.length})`);

            photosOverflow.forEach(async (photo) => {
              // remove foto from db
              await photos.remove({ _id: photo._id });

              removePhoto(photo, 'overflowed');
            });
          });
        }
      });
    };

    const cleanOldThrottled = _.throttle(cleanOld, 5000);
    can.on('cleanup:overflowed', cleanOldThrottled);
  }

  if (deleteOutdated && daysToDelete && daysToDelete > 0) {
    const msOfDay = 1000 * 60 * 60 * 24; // one day
    const deleteInterval = hoursOfDeleteCheck * 60 * 1000;

    const autoRemoveOutdated = () => {
      console.log(`Searching for photos oldest than ${daysToDelete} days`);
      photos.find({}).exec((err, phs) => {
        const tooYoungToDie = phs.filter(photo => !photo.date || ((new Date() - new Date(photo.date)) > msOfDay * daysToDelete));
        console.log(`${tooYoungToDie.length} old photos found. Total photos ${phs.length}.`);
        console.log('tooYoungToDie');
        console.log(tooYoungToDie);

        if (tooYoungToDie.length > 0) {
          try {
            photos.remove({
              _id: { $in: tooYoungToDie.map(photo => photo._id) },
            }, {
              multi: true
            }, (err, removedCount) => {
              if (err) throw err;

              console.log(`Deleted ${removedCount} old photo(s)`);
              can.emit('photos:sync', tooYoungToDie);

              tooYoungToDie.forEach(photo => removePhoto(photo, 'outdated'));
              setTimeout(autoRemoveOutdated, deleteInterval);
            });
          } catch (e) {
            console.error(e);
            setTimeout(autoRemoveOutdated, deleteInterval);
          }
        } else {
          setTimeout(autoRemoveOutdated, deleteInterval);
        }
      });
    };

    autoRemoveOutdated();
  }
};
