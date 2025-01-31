const Category = require('../models/category.model');

/**
 * A helper function to build a tree structure of Categories
 * @param {Array} allCategories - all Category documents from the database
 * @param {ObjectId|null} parentId the parent category ID (or null for root-level)
 * @returns {Array} - an array of Category with nested children
 */

function buildCategoryTree(allCategories, parentId = null) {
  return allCategories.filter((category) => {
    if (!category.parent && !parentId) return true;
    return category.parent?.toString() === parentId?.toString();
  }).map((category) => {
    return {
      _id: category._id,
      title: category.title,
      children: buildCategoryTree(allCategories, category._id)
    };
  });
}

module.exports = () => {
  return {
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
  };
};