const express = require('express');

const app = express();
const PORT = process.env.PORT || 3000;

app.listen(3000, () => {
	console.log(`Сервер был запущен на порту ${PORT}`);
});
