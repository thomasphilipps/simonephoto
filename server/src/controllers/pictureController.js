import path from 'path';

const ALLOWED_TYPES = ['image/jpg', 'image/jpeg', 'image/png'];
const MAX_FILE_SIZE = 5 * 1024 * 1024;

function imageValidator(req, res, next) {
  const file = req.file;

  if (!file) {
    return res.status(400).json({error: 'No file provided'});
  }

  if (!ALLOWED_TYPES.includes(file.mimetype)) {
    return res.status(415).json({error: 'Unsupported file format'});
  }

  const ext = path.extname(file.originalname).toLowerCase();
  const expectedExt = file.mimetype.split('/')[1];

  if (ext !== `.${expectedExt}`) {
    return res.status(415).json({error: 'MIME type and file extension do not match'});
  }

  if (file.size > MAX_FILE_SIZE) {
    return res.status(413).json({error: 'File size exceeds the allowed limit'});
  }

  next();
}

export default () => ({
  uploadImage: async (req, res) => {
    imageValidator(req, res, () => {
      res.status(200).json({message: 'File uploaded successfully'});
    });
  }
});