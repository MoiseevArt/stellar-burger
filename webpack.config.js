const path = require('path');
const ESLintPlugin = require('eslint-webpack-plugin');
const HtmlWebpackPlugin = require('html-webpack-plugin');
const Dotenv = require('dotenv-webpack');

const SRC_DIR = path.resolve(__dirname, './src');
const DIST_DIR = path.resolve(__dirname, './dist');
const PUBLIC_DIR = path.resolve(__dirname, './public');

const FILE_EXTENSIONS = [
  '*',
  '.js',
  '.jsx',
  '.ts',
  '.tsx',
  '.json',
  '.css',
  '.scss',
  '.png',
  '.svg',
  '.jpg'
];

const PATH_ALIASES = {
  '@pages': path.resolve(SRC_DIR, './pages'),
  '@components': path.resolve(SRC_DIR, './components'),
  '@ui': path.resolve(SRC_DIR, './components/ui'),
  '@ui-pages': path.resolve(SRC_DIR, './components/ui/pages'),
  '@utils-types': path.resolve(SRC_DIR, './utils/types'),
  '@api': path.resolve(SRC_DIR, './utils/burger-api.ts'),
  '@slices': path.resolve(SRC_DIR, './services/slices'),
  '@selectors': path.resolve(SRC_DIR, './services/selectors')
};

const moduleRules = [
  {
    test: /\.(js|jsx)$/,
    exclude: /node_modules/,
    use: ['babel-loader']
  },
  {
    test: /\.(ts)x?$/,
    exclude: /node_modules/,
    use: {
      loader: 'ts-loader'
    }
  },
  {
    test: /\.css$/,
    exclude: /\.module\.css$/,
    use: ['style-loader', 'css-loader']
  },
  {
    test: /\.module\.css$/i,
    exclude: /node_modules/,
    use: [
      'style-loader',
      {
        loader: 'css-loader',
        options: {
          modules: true
        }
      }
    ]
  },
  {
    test: /\.(jpg|jpeg|png|svg)$/,
    type: 'asset/resource'
  },
  {
    test: /\.(woff|woff2)$/,
    type: 'asset/resource'
  }
];

const plugins = [
  new ESLintPlugin({
    extensions: ['.js', '.jsx', '.ts', '.tsx']
  }),
  new HtmlWebpackPlugin({
    template: path.join(PUBLIC_DIR, 'index.html')
  }),
  new Dotenv({
    path: './.env.example'
  })
];

module.exports = {
  entry: path.resolve(SRC_DIR, './index.tsx'),
  module: { rules: moduleRules },
  plugins,
  resolve: {
    extensions: FILE_EXTENSIONS,
    alias: PATH_ALIASES
  },
  output: {
    path: DIST_DIR,
    filename: 'bundle.js'
  },
  devServer: {
    static: {
      directory: DIST_DIR
    },
    compress: true,
    historyApiFallback: true,
    port: 4000
  }
};
