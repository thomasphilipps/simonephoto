export default (Model) => ({
  create: async (req, res) => {
    try {
      const doc = await Model.create(req.body);
      return res.status(201).json(doc);
    } catch (error) {
      return res.status(400).json({error: error.message});
    }
  },

  readAll: async (req, res) => {
    try {
      const docs = await Model.find();
      return res.status(200).json(docs);
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  },

  readById: async (req, res) => {
    try {
      const doc = await Model.findById(req.params.id);
      if (!doc) {
        return res.status(404).json({error: 'Not found'});
      }
      return res.status(200).json(doc);
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  },

  update: async (req, res) => {
    try {
      const doc = await Model.findByIdAndUpdate(
        req.params.id,
        req.body,
        {new: true, runValidators: true}
      );
      if (!doc) {
        return res.status(404).json({error: 'Not found'});
      }
      return res.status(200).json(doc);
    } catch (error) {
      return res.status(400).json({error: error.message});
    }
  },

  delete: async (req, res) => {
    try {
      const doc = await Model.findByIdAndDelete(req.params.id);
      if (!doc) {
        return res.status(404).json({error: 'Not found'});
      }
      return res.status(204).send();
    } catch (error) {
      return res.status(500).json({error: error.message});
    }
  }
});