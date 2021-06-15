const { Router } = require('express');
const router = new Router();

router.get('/', (req, res) => {
	res.render('add', {
		title: 'Добавить курс',
		isAdd: true,
	});
});

module.exports = router;
