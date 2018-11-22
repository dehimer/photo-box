const express = require('express');
const NeDB = require('nedb');
const socketIO = require('socket.io');
const gm = require('gm');
const fs = require('fs');
const http = require('http');
const path = require('path');
const config = require('../../config/config');


// DB
const dbStat = new NeDB({ filename: 'db/stat.db', autoload: true });
const dbPhoto = new NeDB({ filename: 'db/photo.db', autoload: true });

dbPhoto.find({}).exec((err, docs) => {
  const count = docs.length || 0;
  console.log(`Found ${count} photos`);
});


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

  dbPhoto.count({ label: source.label }, (err, count) => {
    source.lastNum = count;
  });

  return source;
});

dirs.forEach((dir) => {
  if (!fs.existsSync(dir)) {
    fs.mkdirSync(dir);
  }
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

io.on('connection', (socket) => {
  socket.emit('action', { type: 'config', data: config });
  /*
  dbPhoto.find({}).sort({ date: -1 }).limit(config.imagesPerPage).exec((err, photos) => {
    socket.emit('list', photos);
  });

  socket.on('print', function(data){
    console.log('PRINT', data);
    for (var i = 0; i < data.length; i+=2) {

      var photo1 = __dirname+'/images/'+data[i];
      var photo2;
      if (i + 1 >= data.length) {
        photo2 = __dirname+'/images/'+data[i];
      } else {
        photo2 = __dirname+'/images/'+data[i+1];
      }

      print2Photo(photo1, photo2);
    }
  });
  */
});
