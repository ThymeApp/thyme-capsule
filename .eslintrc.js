module.exports = {
  parser: 'babel-eslint',
  plugins: [
    'flowtype',
  ],
  extends: ['airbnb-base', 'plugin:flowtype/recommended'],
  env: {
    jest: true,
  },
};
