const Course = require('../models/Course')
const { mutipleMongooseToObject } = require('../../util/mongoose')

class MeController {
    //[GET] 
    storedCourses(req, res, next) {
        let courseQuerry = Course.find({});

        if (req.query.hasOwnProperty('_sort')) {
            courseQuerry = courseQuerry.sort({
                [req.query.column]: req.query.type,
            });
        }
        Promise.all([courseQuerry, Course.countDocumentsDeleted()])
            .then(([courses, deletedCount]) => {
                res.render('me/stored-courses', {
                    deletedCount,
                    courses: mutipleMongooseToObject(courses)
                })
            }
            )
            .catch(next)
    }

    trashCourses(req, res, next) {
        Course.findDeleted({})
            .then(courses => res.render('me/trash-courses', {
                courses: mutipleMongooseToObject(courses)
            }))
            .catch(next)
    }

}

module.exports = new MeController()


