const { Router } = require('express');
const router = new Router();

router.get('/login', async (req, res) => {
	res.render('auth/login', {
		title: 'Вход',
		isSignin: true,
	});
});

module.exports = router;
