const nodemailer = require('nodemailer');
const express = require('express');
const Emitter = require('events');
const request = require('request');
const fs = require('fs');
const NeDB = require('nedb');
const socketIO = require('socket.io');
const http = require('http');
const path = require('path');
const gm = require('gm');
const exec = require('child_process').exec;
const config = require('../../config/config');
const watcher = require('./watcher');

const can = new Emitter();

// create reusable transporter object using the default SMTP transport
const mailtransporter = nodemailer.createTransport(config.mail.smtp);

const imagesDirPath = path.join(__dirname, '..', '..', 'images');


// HTTP
const port = config.port || 3000;
const app = express();
const server = http.createServer(app);

app.use(express.static('dist'));
app.use('/images', express.static(imagesDirPath));
app.use('/public', express.static(path.join(__dirname, '..', '..', 'public')));


server.listen(port, () => {
  console.log(`Server is ran on : http://localhost:${port}`);
});


// SOCKETIO
const io = socketIO();
io.attach(server);

io.on('connection', (socket) => {
  can.emit('config:sync', socket);
  can.emit('photos:sync', socket);

  socket.on('action', (action) => {
    console.log(action);
    const { type, data } = action;
    switch (type) {
      case 'server/print':
        console.log('EMIT photo:print');
        can.emit('photo:print', data);
        break;
      case 'server/send':
        console.log('EMIT photo:send');
        can.emit('photo:send', data);
        break;
      default: console.log(`Unknown action ${type}`);
    }
  });
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

can.on('photo:update', async (photo) => {
  // eslint-disable-next-line no-underscore-dangle
  await db.photos.update({ id: photo.id }, photo);
  // send to all clients
  can.emit('photos:sync');
});

can.on('photo:send', ({ email, photo }) => {
  const { mail: { from, subject, urlOnly } } = config;


  const content = urlOnly
    ? `Download photo by link ${photo.uploadedUrl}`
    : 'Check photo in attachment';

  const mailOptions = {
    from,
    to: email,
    subject: `${subject} (${photo.name})`,
    html: content,
    text: content,
  };

  if (!urlOnly) {
    mailOptions.attachments = [{
      filename: path.basename(photo.src),
      content: fs.createReadStream(path.join(imagesDirPath, photo.src))
    }];
  }

  // send mail with defined transport object
  mailtransporter.sendMail(mailOptions, (error, info) => {
    if (error) {
      return console.log(error);
    }
    console.log('Message sent: %s', info.messageId);
    return false;
  });
});

can.on('photo:print', (photo) => {
  console.log('photo:print');
  console.log(photo);
  const fullname = path.basename(photo.src);
  console.log(fullname);
  const photoPath = path.join(imagesDirPath, photo.src);
  console.log('photoPath:');
  console.log(photoPath);
  const printDir = path.join(imagesDirPath, 'print');
  if (!fs.existsSync(printDir)) {
    fs.mkdirSync(printDir);
  }
  const printName = path.join(imagesDirPath, 'print', `${(new Date()).getTime()}${fullname}`);
  console.log('printName:');
  console.log(printName);
  gm(photoPath).write(printName, (err) => {
    if (err) {
      console.log(err);
      return;
    }
    const cmd = `rundll32 shimgvw.dll,ImageView_PrintTo "${printName}" "${config.printerName}"`;
    console.log('cmd:');
    console.log(cmd);

    exec(cmd, (error, stdout, stderr) => {
      if (error || stderr) {
        console.log(error, stderr);
      } else {
        console.log('Printing');
        setTimeout(() => {
          fs.unlink(printName);
        }, 15000);
      }
    });
  });
});

can.on('photo:upload', (photoData) => {
  const photo = { ...photoData };

  const formData = {
    myFile: fs.createReadStream(`${imagesDirPath}/${photo.src}`)
  };

  photo.uploadedUrl = `${config.photoHostUrl}/${photo.name}`;

  can.emit('photo:update', photo);

  request.post({
    url: `${config.photoHostUrl}/uploader.php`,
    formData
  }, (err, httpResponse, body) => {
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

can.on('photos:sync', (socket = io) => {
  db.photos.find({}).sort({ date: -1 }).limit(config.imagesPerPage).exec((err, photos) => {
    socket.emit('action', { type: 'photos', data: photos });
  });
});

can.on('config:sync', (socket = io) => {
  console.log('config:sync');
  socket.emit('action', { type: 'config', data: config });
});


watcher({ ...config, imagesDirPath }, db.photos, can);
