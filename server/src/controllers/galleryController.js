const Gallery = require('../models/gallery.model');

/**
 * Creates a new Gallery
 */
exports.createGallery = async (req, res) => {
    try {
        const {title, description, pictures, categories, date} = req.body;
        const newGallery = await Gallery.create({
            title,
            description,
            date,
            pictures,
            categories,
        });
        return res.status(201).json(newGallery);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

/**
 * Retrieves all Galleries
 */
exports.getGalleries = async (req, res) => {
    try {
        const galleries = await Gallery.find();
        return res.status(200).json(galleries);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

/**
 * Retrieves a single Gallery by ID
 */
exports.getGalleryById = async (req, res) => {
    try {
        const {id} = req.params;
        const gallery = await Gallery.findById(id);
        if (!gallery) {
            return res.status(404).json({error: 'Gallery not found'});
        }
        return res.status(200).json(gallery);
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};

/**
 * Updates a Gallery by ID
 */
exports.updateGallery = async (req, res) => {
    try {
        const {id} = req.params;
        const {title, description, date, pictures, categories} = req.body;

        const updatedGallery = await Gallery.findByIdAndUpdate(
            id,
            {title, description, date, pictures, categories},
            {new: true, runValidators: true}
        );

        if (!updatedGallery) {
            return res.status(404).json({error: 'Gallery not found'});
        }

        return res.status(200).json(updatedGallery);
    } catch (error) {
        return res.status(400).json({error: error.message});
    }
};

/**
 * Deletes a Gallery by ID
 */
exports.deleteGallery = async (req, res) => {
    try {
        const {id} = req.params;
        const deletedGallery = await Gallery.findByIdAndDelete(id);

        if (!deletedGallery) {
            return res.status(404).json({error: 'Gallery not found'});
        }

        return res.status(204).send();
    } catch (error) {
        return res.status(500).json({error: error.message});
    }
};
