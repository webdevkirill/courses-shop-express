const { Router } = require('express');
const router = new Router();
const Cart = require('../models/cart');
const Course = require('../models/course');

router.post('/add', async (req, res) => {
	const course = await Course.getCourseById(req.body.id);
	await Cart.add(course);
	res.redirect('/cart');
});

router.get('/', async (req, res) => {
	const cart = Cart.fetch();
	res.render('cart', {
		title: 'Корзина',
		isCart: true,
		courses: cart.courses,
		price: cart.price,
	});
});

module.exports = router;