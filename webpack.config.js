module.exports = {
	entry: "./js/module.js",
	output: {
		path: __dirname + "/js",
		filename: "bundle.js"
	},

	module: {
		rules: [{
			// Style (raw CSS, Sass/SCSS and Stylus)
			test: /\.css$/,
			use: [
				'style-loader',
				'css-loader',
			]
	 	}]
	 }
};