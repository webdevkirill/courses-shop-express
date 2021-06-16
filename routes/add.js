const { Router } = require('express');
const router = new Router();
const Cource = require('../models/course');

router.get('/', (req, res) => {
	res.render('add', {
		title: 'Добавить курс',
		isAdd: true,
	});
});

router.post('/', (req, res) => {
	const cource = new Cource(req.body);
	cource
		.save()
		.then(() => {
			res.redirect('/courses');
		})
		.catch((e) => {
			alert('Произошла ошибка' + e);
		});
});

module.exports = router;
