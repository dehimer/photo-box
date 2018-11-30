const express = require('express');
const NeDB = require('nedb');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const config = require('../../config/config');
const watcher = require('./watcher');


// DB
// const dbStats = new NeDB({ filename: 'db/stat.db', autoload: true });
const dbPhotos = new NeDB({ filename: 'db/photo.db', autoload: true });

dbPhotos.find({}).exec((err, docs) => {
  const count = docs.length || 0;
  console.log(`Found ${count} photos`);
});


// HTTP
const port = config.port || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));
app.use(express.static(path.join(__dirname, 'images')));


server.listen(port, () => {
  console.log(`Server is ran on : http://localhost:${port}`);
});


// SOCKETIO
const io = socketIO();
io.attach(server);

const syncPhotos = (socket) => {
  dbPhotos.find({}).exec((err, docs) => {
    socket.emit('action', { type: 'photos', data: docs });
  });
};

io.on('connection', (socket) => {
  socket.emit('action', { type: 'config', data: config });
  syncPhotos(socket);

  /*
  socket.on('action', async (action) => {
    switch (action.type) {
      case 'server/ACTION_TYPE': {
        io.sockets.emit('action', {type: 'players_update_ts', data: +(new Date())})
      }
        break;
    }
  });
  */
});
