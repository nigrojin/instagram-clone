const multer = require('multer');
const path = require('path');

module.exports = function fileHandler(dest) {
  const upload = multer({
    // 저장공간, 파일이름
    storage: multer.diskStorage({
      destination: (req, file, cb) => {
        cb(null, `${__dirname}/../files/${dest}/`)
      },
  
      filename: (req, file, cb) => {
        const ext = path.extname(file.originalname);
        cb(null, Date.now() + ext)
      }
    }),
    // 파일 필터링
    fileFilter: (req, file, cb) => {
      const ext = path.extname(file.originalname);
  
      if (ext === '.jpg' || ext === '.jpeg' || ext === '.png') {
        return cb(null, true)
      }
  
      cb(new TypeError('Not acceptable type of files.'));
    },
    // 파일 사이즈, 갯수 제한
    limits: {
      fileSize: 1e7,
      files: 10
    }
  })

  return upload;
}