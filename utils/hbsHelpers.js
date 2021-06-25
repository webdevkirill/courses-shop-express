module.exports = {
	ifeq(a, b, opt) {
		if (a == b) {
			return opt.fn(this);
		}
		opt.inverse(this);
	},
};
