const Picture = require('../models/picture.model');

function imageValidator(req, res, next) {
// Check if image exists
  if (!req.file) {
    return res.status(400).json({error: 'No file provided'});
  }
  next();
}

module.exports = () => {
  return {
    uploadImage: async (req, res) => {
      imageValidator(req, res, () => {
        
      });

    }
  };
};