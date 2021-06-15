const express = require('express');
const path = require('path');
const exphbs = require('express-handlebars');
const homeRoute = require('./routes/home');
const addRoute = require('./routes/add');
const coursesRoute = require('./routes/courses');



const app = express();

const hbs = exphbs.create({
	defaultLayout: 'main',
	extname: 'hbs',
});

app.engine('hbs', hbs.engine);
app.set('view engine', 'hbs');
app.set('views', 'views');

app.use(express.static('public'));

app.use('/', homeRoute)
app.use('/add', addRoute)
app.use('/courses', coursesRoute)

const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
	console.log(`Сервер был запущен на порту ${PORT}`);
});
