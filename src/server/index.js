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

const imagesDirPath = path.join(__dirname, '..', '..', 'images');


// HTTP
const port = config.port || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));
app.use('/images', express.static(imagesDirPath));
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));

/*app.get('/!*', (req, res) => {
  res.sendFile(path.join(__dirname, '..', '..', 'public', 'index.html'), (err) => {
    if (err) {
      res.status(500).send(err);
    }
  });
});*/


server.listen(port, () => {
  console.log(`Server is ran on : http://localhost:${port}`);
});


// SOCKETIO
const io = socketIO();
io.attach(server);

io.on('connection', (socket) => {
  console.log('connection');
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
  db.photos.insert(data, (err) => {
    if (!err) can.emit('photos:sync');
  });
});

can.on('photo:send', (photoData) => {
  console.log('photo:send');
  const photo = { ...photoData };
  console.log(photo);

  console.log('syncPhoto');
  const formData = {
    myFile: fs.createReadStream(`${imagesDirPath}/${photo.src}`)
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

can.on('photos:sync', (socket = io) => {
  console.log('photos:sync');
  db.photos.find({}).sort({ date: -1 }).limit(config.imagesPerPage).exec((err, photos) => {
    socket.emit('action', { type: 'photos', data: photos });
  });
});

can.on('config:sync', (socket = io) => {
  console.log('config:sync');
  socket.emit('action', { type: 'config', data: config });
});


watcher({ ...config, imagesDirPath }, db.photos, can);
