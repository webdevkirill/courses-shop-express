const { Router } = require('express');
const Course = require('../models/course');
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

router.get('/:id/edit', async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}
	const course = await Cource.getCourseById(req.params.id);

	res.render('courseEdit', {
		title: `Редактировать курс ${course.title}`,
		course,
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

router.post('/edit', async (req, res) => {
	await Course.update(req.body);
	res.redirect('/courses');
});

module.exports = router;
