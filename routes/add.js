const { Router } = require('express');
const router = new Router();
const { validationResult } = require('express-validator');
const Cource = require('../models/course');
const auth = require('../middleware/auth');
const { courseValidators } = require('../utils/validators');

router.get('/', auth, (req, res) => {
	res.render('add', {
		title: 'Добавить курс',
		isAdd: true,
	});
});

router.post('/', auth, courseValidators, async (req, res) => {
	const errors = validationResult(req);

	const { title, price, img } = req.body;

	if (!errors.isEmpty()) {
		return res.status(422).render('add', {
			title: 'Добавить курс',
			isAdd: true,
			error: errors.array()[0].msg,
			data: {
				title,
				price,
				img,
			},
		});
	}

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
