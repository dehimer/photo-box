var config = {
  port: 3000,

  sources: [
    {
      watchpath: "../../Pictures/zd1",
      label: "A",
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

  deleteAfterImport: true,
  useWatchFile: false,

  imagesPerPage: 200,
  printerName: 'DS-RX1 (копия 1)',

  viewerCloseAfter: 35,

  thumbnail: {
    width: 300,
    height: 200
  },

  max_select: 1,

  mail: {
    from : "Алиса - Возвращение в страну чудес <cat@hello-alice.ru>",
    subject: "Ваша фотография",
    attemptsLimit: 100,
    smtp: {
      host: "p188309.mail.ihc.ru",
      port: 25,
      auth: {
        user: "io@hello.io",
        pass: "ioioio88"
      },
      tls: {
        rejectUnauthorized: false
      }
    }
  },

  attempts_intrrval: 10e3,
  attempts_limit: 10,
  printer_name: "Microsoft Print to PDF",
  send_to_email: true,
  send_to_print: false,

  uploadUrl: 'http://zzhkg.silkroadcg.top/uploader.php'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
