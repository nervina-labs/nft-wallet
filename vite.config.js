// vite.config.js
const reactRefresh = require('@vitejs/plugin-react-refresh')
const svgr = require('vite-plugin-svgr')

module.exports = {
  plugins: [reactRefresh(), svgr()],
}
