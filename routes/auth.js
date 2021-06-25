const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = new Router();
const User = require('../models/user');

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Вход',
		isSignin: true,
		signinerror: req.flash('signinerror'),
		signuperror: req.flash('signuperror'),
	});
});

router.get('/logout', async (req, res) => {
	req.session.destroy(() => {
		res.redirect('/auth/login#signin');
	});
});

router.post('/signin', async (req, res) => {
	try {
		const { email, password } = req.body;
		const candidate = await User.findOne({ email });

		if (candidate) {
			const isSamePass = await bcrypt.compare(
				password,
				candidate.password
			);
			if (isSamePass) {
				req.session.user = candidate;
				req.session.isAuth = true;
				req.session.save((err) => {
					if (err) {
						throw err;
					}
					res.redirect('/');
				});
			} else {
				req.flash('signinerror', 'Пароль неверный');
				res.redirect('/auth/login#signin');
			}
		} else {
			req.flash('signinerror', 'Такого пользователя не существует');
			res.redirect('/auth/login#signin');
		}
	} catch (e) {
		console.error(e);
	}
});

router.post('/signup', async (req, res) => {
	try {
		const { email, password, passwordconfirm, name } = req.body;
		const candidate = await User.findOne({ email });
		if (candidate) {
			req.flash('signuperror', 'Такой email уже занят');
			res.redirect('/auth/login#signup');
		} else {
			const hashPassword = await bcrypt.hash(password, 10);
			const user = new User({
				email,
				password: hashPassword,
				name,
				cart: { items: [] },
			});
			await user.save();
			res.redirect('/auth/login#signin');
		}
	} catch (e) {
		console.error(e);
	}
});

module.exports = router;
