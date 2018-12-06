const config = {
  port: 3000,

  sources: [
    {
      watchpath: '../../Pictures/zd1',
      label: 'A',
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
  viewerCloseAfter: 35,

  photoHostUrl: 'http://zzhkg.silkroadcg.top',

  uploadUrl: 'http://zzhkg.silkroadcg.top/uploader.php'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
