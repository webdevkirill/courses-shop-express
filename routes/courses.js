const { Router } = require('express');
const Course = require('../models/course');
const router = new Router();
const auth = require('../middleware/auth');

router.get('/', async (req, res) => {
	const courses = await Course.find().populate('userId', 'email name');
	console.log(courses);

	res.render('courses', {
		title: 'Все курсы',
		isCourses: true,
		courses,
	});
});

router.get('/:id/edit', auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}
	const course = await Course.findById(req.params.id);

	res.render('courseEdit', {
		title: `Редактировать курс ${course.title}`,
		course,
	});
});

router.get('/:id', async (req, res) => {
	const course = await Course.findById(req.params.id);
	const title = `Курс ${course.title}`;

	res.render('course', {
		layout: 'empty',
		title,
		course,
	});
});

router.post('/edit', auth, async (req, res) => {
	const { id } = req.body;
	delete req.body.id;
	await Course.findByIdAndUpdate(id, req.body);
	res.redirect('/courses');
});

router.post('/remove', auth, async (req, res) => {
	try {
		await Course.deleteOne({ _id: req.body.id });
		res.redirect('/courses');
	} catch (e) {
		console.error(e);
	}
});

module.exports = router;
