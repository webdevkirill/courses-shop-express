const { Router } = require('express');
const router = new Router();
const Cource = require('../models/course');

router.get('/', (req, res) => {
	res.render('add', {
		title: 'Добавить курс',
		isAdd: true,
	});
});

router.post('/', async (req, res) => {
	const { title, price, img } = req.body;

	const cource = new Cource({
		title,
		price,
		img,
		userId: req.user,
	});

	try {
		await cource.save();
		res.redirect('/courses');
	} catch (e) {
		console.error('Произошла ошибка' + e);
	}
});

module.exports = router;
