import Category from '../models/category.model.js';

function buildCategoryTree(allCategories, parentId = null) {
  return allCategories.filter((category) => {
    if (!category.parent && !parentId) return true;
    return category.parent?.toString() === parentId?.toString();
  }).map((category) => ({
    _id: category._id,
    title: category.title,
    children: buildCategoryTree(allCategories, category._id)
  }));
}

export default () => ({
  getCategoryTree: async (req, res) => {
    try {
      const allCategories = await Category.find({});
      const menuTree = buildCategoryTree(allCategories);
      return res.status(200).json(menuTree);
    } catch (error) {
      console.error('Error in getCategoryTree', error);
      return res.status(500).json({error: error.message});
    }
  }
});