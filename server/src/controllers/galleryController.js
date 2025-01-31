const Gallery = require('../models/gallery.model');
/**
 * Retrieves a single Gallery by ID
 */

module.exports = () => {
  return {
    getGalleryById: async (req, res) => {
      try {
        const {id} = req.params;
        const gallery = await Gallery.findById(id)
          .populate('pictures').exec();
        if (!gallery) {
          return res.status(404).json({error: 'Gallery not found'});
        }
        return res.status(200).json(gallery);
      } catch (error) {
        return res.status(500).json({error: error.message});
      }
    }
  };
};
