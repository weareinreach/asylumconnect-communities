const express = require('express')
const mongoose = require('mongoose')
const router = express.Router()
const CategoryModel = require('../models/Category')
const SubcategoryModel = require('../models/Subcategory')
const resUtils = require('../utils/responseUtils')

const createSuccessResponse = resUtils.createSuccessResponse

//used to populate the database with categories and subcategories
const initializerHelper = datum => {
    const { categoryTitle, subcategoriesList } = datum
    CategoryModel.create({
        _id: new mongoose.Types.ObjectId(),
        title: categoryTitle,
    }, async function (err, category) {
        if (err) {
            console.log(err)
        }
        subcategoriesList.forEach(async subElement => {
            SubcategoryModel.create({
                _id: new mongoose.Types.ObjectId(),
                category: category._id,
                title: subElement.title
            }, function (err, subcategory) {
                if (err) {
                    console.log(err)
                }
                CategoryModel
                    .findById(category._id)
                    .then(async category => {
                        category.subcategories.push(subcategory._id)
                        category
                            .save()
                            .then(category => { return })
                            .catch(err => console.log(err))
                    }).catch(err => {
                        console.log(err)
                    })
            })
        });
    })
}

//provides the title for categories and subcategories 
//these are displayed after db is intialized by the 
//correct route.
router.get('/', async (req, res) => {
    const data = [
        {
            categoryTitle: "Welcome",
            subcategoriesList: [
                { title: "Introduce yourself!" }
            ]
        },
        {
            categoryTitle: "The Community",
            subcategoriesList: [
                { title: "Meet an LGBTQ Asylee" },
                { title: "Legal Questions" },
                { title: "Leaving your country" }
            ]
        },
        {
            categoryTitle: "Category",
            subcategoriesList: [
                { title: "Sub-Category" },
                { title: "Sub-Category" }
            ]
        }
    ]

    data.forEach(datum => initializerHelper(datum))

    return res.send(createSuccessResponse({
        message: "Database successfully initialized"
    }))
})

module.exports = router