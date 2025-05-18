import type { Configuration as WebpackConfig } from 'webpack'
import type { Configuration as DevServerConfig } from 'webpack-dev-server'
import HtmlWebpackPlugin from 'html-webpack-plugin'
import path from 'path'
import { fileURLToPath } from 'url'

interface Configuration extends WebpackConfig {
  devServer?: DevServerConfig;
}

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)

const config: Configuration = {
  mode: 'development', // Change to 'production' for production builds
  entry: './src/index.ts', // Entry point of your application
  output: {
    path: path.resolve(__dirname, 'dist'),
    filename: 'bundle.js',
    clean: true, // Cleans the output directory before each build
  },
  resolve: {
    extensions: ['.ts', '.js'], // Resolve these extensions
  },
  module: {
    rules: [
      {
        test: /\.tsx?$/, // Matches .ts and .tsx files
        use: 'ts-loader',
        exclude: /node_modules/,
      }
    ],
  },
  plugins: [
    new HtmlWebpackPlugin({
      template: './public/index.html', // Template for the HTML file
    }),
  ],
  devServer: {
    static: {
      directory: path.resolve(__dirname, 'dist'), // Serve static files from the output directory
    },
    compress: true, // Enable gzip compression
    port: 9000, // Port to run the dev server
    open: true, // Automatically open the browser
    hot: true, // Enable Hot Module Replacement
  },
};

export default config;