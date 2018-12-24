const config = {
  port: 3000,

  sources: [
    {
      watchpath: '../../Pictures/zd1',
      label: 'A',
      frame: 'config/frame4.png',
      special: false,
      crop: {
        x: 1963,
        y: 46,
        width: 1334,
        height: 983
      },
      crop2: {
        x: 672,
        y: 46,
        width: 1334,
        height: 983
      }
    }
  ],

  thumbnail: {
    width: 300,
    height: 200
  },

  deleteAfterImport: true,
  useWatchFile: false,

  imagesPerPage: 200,
  viewerCloseAfter: 10,

  photoHostUrl: 'http://zzhkg.silkroadcg.top',

  uploadUrl: 'http://zzhkg.silkroadcg.top/uploader.php',

  printerName: 'DS-RX1 (копия 1)',
  mode: 'print',

  mail: {
    from: 'Photobox <cat@hello-alice.ru>',
    subject: 'Your photo',
    attemptsLimit: 100,
    smtp: {
      host: 'p188309.mail.ihc.ru',
      port: 25,
      auth: {
        user: 'io@hello.io',
        pass: 'ioioio88'
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
