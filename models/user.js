const { Schema, model } = require('mongoose');

const User = new Schema({
	email: {
		type: String,
		required: true,
	},
	name: {
		type: String,
	},
	password: {
		type: String,
		required: true,
	},
	resetToken: String,
	resetTokenExp: Date,
	avatarURL: String,
	cart: {
		items: [
			{
				count: {
					type: Number,
					required: true,
					default: 1,
				},
				courseId: {
					type: Schema.Types.ObjectId,
					ref: 'Course',
					required: true,
				},
			},
		],
	},
});

User.methods.addToCart = function (course) {
	const items = [...this.cart.items];
	const index = items.findIndex(
		(c) => c.courseId.toString() === course._id.toString()
	);

	if (index >= 0) {
		items[index].count++;
	} else {
		items.push({ count: 1, courseId: course._id });
	}

	this.cart = { items };

	return this.save();
};

User.methods.removeFromCart = function (id) {
	let items = [...this.cart.items];
	const index = items.findIndex(
		(c) => c.courseId.toString() === id.toString()
	);

	if (items[index].count === 1) {
		items = items.filter((c) => c.courseId.toString() !== id.toString());
	} else {
		items[index].count--;
	}

	this.cart = { items };
	return this.save();
};

User.methods.clearCart = function () {
	this.cart = { items: [] };
	return this.save();
};

module.exports = model('User', User);
