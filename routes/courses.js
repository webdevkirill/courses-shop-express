const { Router } = require('express');
const { validationResult } = require('express-validator');
const Course = require('../models/course');
const router = new Router();
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

function isCourseOwner(course, req) {
	return course.userId.toString() === req.user._id.toString();
}

router.get('/', async (req, res) => {
	try {
		const courses = await Course.find().populate('userId', 'email name');
		res.render('courses', {
			title: 'Все курсы',
			isCourses: true,
			courses,
			userId: req.user ? req.user._id.toString() : null,
		});
	} catch (err) {
		console.error(err);
	}
});

router.get('/:id/edit', auth, async (req, res) => {
	if (!req.query.allow) {
		return res.redirect('/');
	}

	try {
		const course = await Course.findById(req.params.id);

		if (!isCourseOwner(course, req)) {
			return res.redirect('/courses');
		}

		res.render('courseEdit', {
			title: `Редактировать курс ${course.title}`,
			course,
		});
	} catch (err) {
		console.error(err);
	}
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

router.post('/edit', auth, courseValidators, async (req, res) => {
	try {
		const { id, title, price, img } = req.body;
		const errors = validationResult(req);
		const course = await Course.findById(id);

		if (!isCourseOwner(course, req)) {
			return res.redirect('/courses');
		}

		if (!errors.isEmpty()) {
			return res.status(422).redirect(`/courses/${id}/edit?allow=true`);
		}

		course.title = title;
		course.price = price;
		course.img = img;

		await course.save();

		res.redirect('/courses');
	} catch (err) {
		console.error(err);
	}
});

router.post('/remove', auth, async (req, res) => {
	try {
		await Course.deleteOne({ _id: req.body.id, userId: req.user._id });
		res.redirect('/courses');
	} catch (e) {
		console.error(e);
	}
});

module.exports = router;
