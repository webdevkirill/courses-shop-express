const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');

const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));

app.get('/', (req, res) => {
	res.render('index', {
		title: 'Главная страница',
		isHome: true,
	});
});

app.get('/courses', (req, res) => {
	res.render('courses', {
		title: 'Все курсы',
		isCourses: true,
	});
});

app.get('/add', (req, res) => {
	res.render('add', {
		title: 'Добавить курс',
		isAdd: true,
	});
});

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
	console.log(`Сервер был запущен на порту ${PORT}`);
});
