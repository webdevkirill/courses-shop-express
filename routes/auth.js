const { Router } = require('express');
const router = new Router();

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
	req.session.isAuth = true;
	res.redirect('/');
});

module.exports = router;
