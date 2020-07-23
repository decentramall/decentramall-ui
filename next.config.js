const BASE_URL = process.env.BASE_URL

module.exports = {
  // Use the CDN in production and localhost for development.
  assetPrefix: BASE_URL && BASE_URL.length ? BASE_URL : '',
}
