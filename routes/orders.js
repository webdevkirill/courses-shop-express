const { Router } = require('express');
const router = new Router();
const Order = require('../models/order');
const auth = require('../middleware/auth');

router.get('/', auth, async (req, res) => {
	try {
		let orders = await Order.find({
			'user.userId': req.user._id,
		}).populate('user.userId');

		orders = orders.map((order) => ({
			...order._doc,
			price: order.courses.reduce(
				(acc, c) => acc + c.count * c.course.price,
				0
			),
		}));

		console.log(orders);

		res.render('orders', {
			isOrders: true,
			title: 'Заказы',
			orders,
		});
	} catch (e) {
		console.error(e);
	}
});

router.post('/', auth, async (req, res) => {
	try {
		const user = await req.user
			.populate('cart.items.courseId')
			.execPopulate();

		const courses = user.cart.items.map((c) => ({
			count: c.count,
			course: {
				...c.courseId._doc,
			},
		}));

		const order = new Order({
			user: {
				name: req.user.name,
				userId: req.user,
			},
			courses,
		});

		await order.save();
		await req.user.clearCart();

		res.render('orders', {
			isOrders: true,
			title: 'Заказы',
		});
	} catch (e) {
		console.error(e);
	}
});

module.exports = router;
