const { Router } = require('express');
const Cource = require('../models/course');
const router = new Router();

router.get('/', async (req, res) => {
	const courses = await Cource.getAllCourses();

	res.render('courses', {
		title: 'Все курсы',
		isCourses: true,
		courses,
	});
});

router.get('/:id', async (req, res) => {
	const course = await Cource.getCourseById(req.params.id);
	const title = `Курс ${course.title}`;

	res.render('course', {
		layout: 'empty',
		title,
		course,
	});
});

module.exports = router;
