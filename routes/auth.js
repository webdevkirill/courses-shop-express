const { Router } = require('express');
const bcrypt = require('bcryptjs');
const router = new Router();
const crypto = require('crypto');
const nodemailer = require('nodemailer');
const sendgrid = require('nodemailer-sendgrid-transport');
const { validationResult } = require('express-validator');
const User = require('../models/user');
const keys = require('../keys/keys');
const regEmail = require('../emails/registration');
const resetEmail = require('../emails/reset');
const { registerValidators } = require('../utils/validators');

const transporter = nodemailer.createTransport(
	sendgrid({
		auth: {
			api_key: keys.SENDGRID_API_KEY,
		},
	})
);

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

router.post('/signup', registerValidators, async (req, res) => {
	try {
		const { email, password, passwordconfirm, name } = req.body;
		const candidate = await User.findOne({ email });

		const errors = validationResult(req);
		if (!errors.isEmpty()) {
			req.flash('signuperror', errors.array()[0].msg);
			return res.status(422).redirect('/auth/login#signup');
		}

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
			await transporter.sendMail(regEmail(email));
		}
	} catch (e) {
		console.error(e);
	}
});

router.get('/reset', (req, res) => {
	res.render('auth/reset', {
		title: 'Забыли пароль?',
		error: req.flash('error'),
	});
});

router.post('/reset', (req, res) => {
	try {
		crypto.randomBytes(32, async (err, buffer) => {
			if (err) {
				req.flash(
					'error',
					'Что-то пошло не так. Повторите попытку позже'
				);
				return res.redirect('/auth/reset');
			}
			const token = buffer.toString('hex');
			const candidate = await User.findOne({ email: req.body.email });

			if (candidate) {
				candidate.resetToken = token;
				candidate.resetTokenExp = Date.now() + 3600000;
				await candidate.save();
				await transporter.sendMail(resetEmail(candidate.email, token));
				res.redirect('/auth/login');
			} else {
				req.flash('error', 'Такой email не найден');
				res.redirect('/auth/reset');
			}
		});
	} catch (e) {
		console.error(e);
	}
});

router.get('/password/:token', async (req, res) => {
	const token = req.params.token;
	if (!token) {
		return res.redirect('/auth/login');
	}

	try {
		const user = await User.findOne({
			resetToken: token,
			resetTokenExp: {
				$gt: Date.now(),
			},
		});

		if (!user) {
			return res.redirect('/auth/login');
		} else {
			res.render('auth/password', {
				title: 'Восстановление пароля',
				error: req.flash('error'),
				userId: user._id.toString(),
				token,
			});
		}
	} catch (err) {
		console.error(err);
	}
});

router.post('/password', async (req, res) => {
	try {
		const { userId, token, password } = req.body;
		const user = await User.findOne({
			_id: userId,
			resetToken: token,
			resetTokenExp: {
				$gt: Date.now(),
			},
		});

		if (user) {
			user.password = await bcrypt.hash(password, 10);
			user.resetToken = undefined;
			user.resetTokenExp = undefined;
			await user.save();
			res.redirect('/auth/login');
		} else {
			req.flash('loginError', 'При сбросе пароля произошла ошибка');
			res.redirect('/auth/login');
		}
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
