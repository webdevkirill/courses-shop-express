const { Router } = require('express');
const router = new Router();
const User = require('../models/user');

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Вход',
		isSignin: true,
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#signin');
	});
});

router.post('/signin', async (req, res) => {
	const user = await User.findById('60d40f878ddd1c516060953c');
	req.session.user = user;
	req.session.isAuth = true;
	req.session.save((err) => {
		if (err) {
			throw err;
		}
		res.redirect('/');
	});
});

module.exports = router;
