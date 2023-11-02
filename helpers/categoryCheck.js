const {
    budget_category
  } = require('../models');
//returns category id
async function getCategoryId(categoryName) {
    let categoryId = await budget_category.findOne({
        where: {
            category_name: categoryName,
        },
        attributes: ['id'],
    })
    //null check
    if (categoryId === null) {
        //insert the category and get the id
        const newCategory = await budget_category.create({
            category_name: categoryName,
        });
        categoryId = newCategory.id;
        return categoryId;
    }
    categoryId =  categoryId.id;
    return categoryId;
}

module.exports = {
    getCategoryId,
};
