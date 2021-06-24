const { Router } = require('express');
const router = new Router();
const Course = require('../models/course');

function mapCartItems(cart) {
	return cart.items.map((c) => ({
		...c.courseId._doc,
		count: c.count,
		id: c.courseId.id,
	}));
}

function computePrice(courses) {
	return courses.reduce(
		(acc, course) => acc + course.count * course.price,
		0
	);
}

router.post('/add', async (req, res) => {
	const course = await Course.findById(req.body.id);

	await req.user.addToCart(course);
	res.redirect('/cart');
});

router.get('/', async (req, res) => {
	const user = await req.user.populate('cart.items.courseId').execPopulate();
	const courses = mapCartItems(user.cart);

	res.render('cart', {
		title: 'Корзина',
		isCart: true,
		courses,
		price: computePrice(courses),
	});
});

router.delete('/remove/:id', async (req, res) => {
	await req.user.removeFromCart(req.params.id);

	const user = await req.user.populate('cart.items.courseId').execPopulate();
	const courses = mapCartItems(user.cart);
	const cart = {
		courses,
		price: computePrice(courses),
	};

	res.status(200).json(cart);
});

module.exports = router;
