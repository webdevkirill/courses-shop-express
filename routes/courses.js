const { Router } = require('express');
const Cource = require('../models/course');
const router = new Router();

router.get('/', async (req, res) => {
	const courses = await Cource.getAllCourses();
	console.log(courses);

	res.render('courses', {
		title: 'Все курсы',
		isCourses: true,
		courses,
	});
});

module.exports = router;
