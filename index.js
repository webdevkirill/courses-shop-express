const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const mongoose = require('mongoose');
const session = require('express-session');
const MongoStore = require('connect-mongodb-session')(session);
const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const coursesRoute = require('./routes/courses');
const cartRoute = require('./routes/cart');
const ordersRoute = require('./routes/orders');
const authRoute = require('./routes/auth');
const varMiddleware = require('./middleware/variables');
const userMiddleware = require('./middleware/user');

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
	runtimeOptions: {
		allowProtoPropertiesByDefault: true,
		allowProtoMethodsByDefault: true,
	},
});

const pass = 'SDfsdfSgh2268';
const MONGODB_URI = `mongodb+srv://kirillwebdev:${pass}@cluster0.kx0fs.mongodb.net/shop`;

const store = new MongoStore({
	collection: 'sessions',
	uri: MONGODB_URI,
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static(path.join(__dirname, 'public')));
app.use(express.urlencoded({ extended: true }));
app.use(
	session({
		secret: 'secret value',
		resave: false,
		saveUninitialized: false,
		store,
	})
);
app.use(varMiddleware);
app.use(userMiddleware);

app.use('/', homeRoute);
app.use('/add', addRoute);
app.use('/courses', coursesRoute);
app.use('/cart', cartRoute);
app.use('/orders', ordersRoute);
app.use('/auth', authRoute);

const PORT = process.env.PORT || 3000;

async function start() {
	try {
		await mongoose.connect(MONGODB_URI, {
			useNewUrlParser: true,
			useUnifiedTopology: true,
			useFindAndModify: false,
		});

		// const candidate = await User.findOne();

		// if (!candidate) {
		// 	const user = new User({
		// 		email: 'krill.fyodorov@gmail.com',
		// 		name: 'krill.fyodorov',
		// 		cart: {
		// 			items: [],
		// 		},
		// 	});

		// 	await user.save();
		// }

		app.listen(3000, () => {
			console.log(`Сервер был запущен на порту ${PORT}`);
		});
	} catch (e) {
		console.error(e);
	}
}
start();
