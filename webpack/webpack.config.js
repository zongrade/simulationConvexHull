const { default: merge } = require('webpack-merge')
const webpackCommon = require('./webpack.common')

module.exports = (envVars) => {
  const { env } = envVars
  const envConfig = require(`./webpack.${env}.js`)
  return merge(webpackCommon, envConfig)
}
