const { v4 } = require('uuid');
const fs = require('fs');
const path = require('path');

class Course {
	constructor({ title, price, img }) {
		this.title = title;
		this.price = price;
		this.img = img;
		this.id = v4();
	}

	async save() {
		const courses = await Course.getAllCourses();
		courses.push(this.dataToObj());

		return new Promise((resolve, reject) => {
			fs.writeFile(
				path.join(__dirname, '../', 'data', 'courses.json'),
				JSON.stringify(courses),
				(err) => {
					if (err) {
						reject(err);
					} else {
						resolve();
					}
				}
			);
		});
	}

	static getAllCourses() {
		return new Promise((resolve, reject) => {
			fs.readFile(
				path.join(__dirname, '../data', 'courses.json'),
				'utf-8',
				(err, data) => {
					if (err) {
						reject(err);
					} else {
						resolve(JSON.parse(data));
					}
				}
			);
		});
	}

	static async getCourseById(id) {
		const courses = await Course.getAllCourses();
		return courses.find((c) => c.id === id);
	}

	dataToObj() {
		return {
			title: this.title,
			price: this.price,
			img: this.img,
			id: this.id,
		};
	}
}

module.exports = Course;
