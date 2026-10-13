const multer = require('multer');
const { createHttpError } = require('../utils');

const upload = multer({
  storage: multer.memoryStorage(),
  limits: {
    fileSize: 10 * 1024 * 1024,
    files: 1,
    fields: 1,
    parts: 2,
    fieldSize: 80 * 1024,
  },
  fileFilter(req, file, callback) {
    if (file.mimetype !== 'application/pdf') {
      callback(createHttpError(400, 'The resume must be uploaded as a PDF.'));
      return;
    }
    callback(null, true);
  },
});

function uploadResume(req, res, next) {
  upload.single('resume')(req, res, (error) => {
    if (!error) {
      next();
      return;
    }

    if (error instanceof multer.MulterError) {
      const message = error.code === 'LIMIT_FILE_SIZE'
        ? 'The PDF must be 10 MB or smaller.'
        : 'The upload must contain one PDF resume and one job description.';
      next(createHttpError(400, message));
      return;
    }

    next(error);
  });
}

module.exports = { uploadResume };
