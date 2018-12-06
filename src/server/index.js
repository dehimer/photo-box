const express = require('express');
const Emitter = require('events');
const request = require('request');
const fs = require('fs');
const NeDB = require('nedb');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const config = require('../../config/config');
const watcher = require('./watcher');

const can = new Emitter();


// HTTP
const port = config.port || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));
/*
if (process.env.NODE_ENV === 'production') {
} else {
  // Exprees will serve up production assets
  app.use(express.static('client/build'));

  // Express serve up index.html file if it doesn't recognize route
  app.get('*', (req, res) => {
    res.sendFile(path.resolve(__dirname, 'client', 'build', 'index.html'));
  });
}
*/

app.use(express.static(path.join(__dirname, 'images')));


server.listen(port, () => {
  console.log(`Server is ran on : http://localhost:${port}`);
});


// SOCKETIO
const io = socketIO();
io.attach(server);

io.on('connection', (socket) => {
  can.emit('config:sync', socket);
  can.emit('photos:sync', socket);
});

// DB
const db = {
  stats: new NeDB({
    filename: 'db/stats.db',
    autoload: true
  }),
  photos: new NeDB({
    filename: 'db/photos.db',
    autoload: true
  })
};

db.photos.find({}).exec((err, photos) => {
  const count = photos.length || 0;
  console.log(`Found ${count} photos`);
});

can.on('photo:new', (data) => {
  // Пишем в базу
  db.photo.insert(data, (err) => {
    if (!err) can.emit('photos:sync');
  });
});

can.on('photo:send', (photoData) => {
  const photo = { ...photoData };

  console.log('syncPhoto');
  const formData = {
    myFile: fs.createReadStream(`${__dirname}/images/${photo.src}`)
  };

  photo.uploadedUrl = `${config.photoHostUrl}/${photo.name}`;

  can.emit('photo:update', photo);

  request.post({ url: `${config.photoHostUrl}/uploader.php`, formData }, (err, httpResponse, body) => {
    if (err || body !== 'success') {
      photo.synced = false;
      console.error('Photos: Upload failed:', err, body);
    } else {
      photo.synced = true;
      console.log('Photos: Upload successful!  Server responded with:', body);
    }

    can.emit('photo:update', photo);
  });
});

can.on('photo:update', async (photo) => {
  // eslint-disable-next-line no-underscore-dangle
  await db.photos.update({ _id: photo._id }, photo);
  // send to all clients
  can.emit('photos:sync');
});

can.on('photos:sync', (socket) => {
  db.photos.find({}).sort({ date: -1 }).limit(config.imagesPerPage).exec((err, photos) => {
    socket.emit('photos', { type: 'config', data: photos });
  });
});

can.on('config:sync', (socket) => {
  socket.emit('action', { type: 'config', data: config });
});


watcher(config, db.photos, can);
