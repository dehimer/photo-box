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

  deleteAfterImport: true,
  useWatchFile: false,

  viewerCloseAfter: 35,

  uploadUrl: 'http://zzhkg.silkroadcg.top/uploader.php'
};

if (typeof module !== 'undefined' && module.exports) {
  module.exports = config;
}
