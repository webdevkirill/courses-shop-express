const { body } = require('express-validator');

exports.registerValidators = [
	body('email', 'Введите корректный email').isEmail(),
	body('password', 'Пароль должен быть минимум 6 символов')
		.isLength({ min: 6, max: 56 })
		.isAlphanumeric(),
	body('passwordconfirm').custom((value, { req }) => {
		if (value !== req.body.password) {
			throw new Error('Пароли не совпадают');
		}
		return true;
	}),
	body('name', 'Имя должно быть минимум 3 символа').isLength({ min: 3 }),
];
