const { Router } = require('express');
const auth = require('../middleware/auth');
const User = require('../models/user');
const router = new Router();

router.get('/', auth, async (req, res) => {
	res.render('profile', {
		title: 'Профиль',
		isProfile: true,
		user: req.user.toObject(),
	});
});

router.post('/', auth, async (req, res) => {
	try {
		let user = await User.findById(req.user._id);

		const toChange = {
			name: req.body.name,
		};

		if (req.file) {
			toChange.avatarURL = req.file.path;
		}

		Object.assign(user, toChange);

		console.log(user);

		await user.save();
		res.redirect('/profile');
	} catch (err) {
		console.error(err);
	}
});

module.exports = router;
