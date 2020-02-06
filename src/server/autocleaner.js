module.exports = (config, photos, can) => {
  const { daysToDelete, hoursOfDeleteCheck = 2 } = config;
  // NOT FINISHED BECOUSE IT IMPLEMENTED IN cleanOld function
  /*if (daysToDelete && daysToDelete > 0) {
    const msOfDay = 1000 * 60 * 60 * 24; // one day
    const deleteInterval = hoursOfDeleteCheck * 60 * 1000;

    const autoRemoveOutdated = () => {
      console.log(`Searching for photos oldest than ${daysToDelete} days`);
      photos.find({}).exec((err, phs) => {
        const tooYoungToDie = phs.filter(photo => !photo.date || ((new Date() - new Date(photo.date)) > msOfDay * daysToDelete));
        console.log(`${tooYoungToDie.length} old photos found. Total photos ${phs.length}.`);

        if (tooYoungToDie.length > 0) {
          try {
            photos.remove({
              _id: { $in: tooYoungToDie.map(photo => photo._id) },
            }, {
              multi: true
            }, (err, removedCount) => {
              if (err) throw err;

              console.log(`Deleted ${removedCount} old photo(s)`);
              can.emit('photo:removed', tooYoungToDie);

              tooYoungToDie.forEach(({ photo }) => {
                console.log('Delete thumbnail ' + path.join(thumbnailPath, photo));
                fs.unlink(path.join(thumbnailPath, photo), err => {
                  if (err) throw err;
                });

                console.log('Удаление фото ' + path.join(standardPath, photo));
                fs.unlink(path.join(standardPath, photo), err => {
                  if (err) throw err;
                });
              });
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
  }*/
};
