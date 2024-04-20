const path = require('path');
const { Extension } = require('typescript');

module.exports = {
	mode: 'development',
	entry: './src/index.ts',
	module: {
		rules: [
			{
				test: /\.css$/i,
				use: ['css-loader'],
			},
			{
				test: /\.tsx?$/,
				use: 'ts-loader',
				exclude: /node_modules/,
			},
		],
	},
	resolve: {
		extensions: ['.tsx', '.ts', '.js'],
	},
	output: {
		filename: 'bundle.js',
		path: path.resolve(__dirname, 'dist'),
	},
};
