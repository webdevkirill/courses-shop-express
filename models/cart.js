const path = require('path');
const fs = require('fs');

class Cart {
	static path = path.join(__dirname, '../', 'data', 'cart.json');

	static async add(course) {
		const cart = await Cart.fetch();
		const index = cart.courses.findIndex((c) => c.id === course.id);
		const candidate = cart.courses[index];

		if (candidate) {
			candidate.count++;
			cart.courses[index] = candidate;
		} else {
			course.count = 1;
			cart.courses.push(course);
		}

		cart.price += +course.price;

		return new Promise((resolve, reject) => {
			fs.writeFile(Cart.path, JSON.stringify(cart), (err) => {
				if (err) {
					reject(err);
				} else {
					resolve();
				}
			});
		});
	}

	static async fetch() {
		return new Promise((resolve, reject) => {
			fs.readFile(Cart.path, 'utf-8', (err, content) => {
				if (err) {
					reject(err);
				} else {
					resolve(JSON.parse(content));
				}
			});
		});
	}
}

module.exports = Cart;
