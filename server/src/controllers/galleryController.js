import Gallery from '../models/gallery.model.js';

export default () => ({
  getGalleryById: async (req, res) => {
    try {
      const {id} = req.params;
      const gallery = await Gallery.findById(id).populate('pictures').exec();
      if (!gallery) {
        return res.status(404).json({error: 'Gallery not found'});
      }
      return res.status(200).json(gallery);
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
});