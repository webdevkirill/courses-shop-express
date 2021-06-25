const keys = require('../keys');

module.exports = function (email, token) {
	return {
		to: email,
		from: keys.EMAIL_FROM,
		subject: 'Восстановление пароля',
		html: `
            <h1>Забыли пароль?</h1>
            <p>Если нет, то проигнорируйте это письмо</p>
            <p>Иначе нажмите на ссылку ниже:</p>
            <p><a href="${keys.BASE_URL}/auth/password/${token}">Восстановить пароль</a></p>
            <hr />
            <a href="${keys.BASE_URL}">В магазин</a>
        `,
	};
};
