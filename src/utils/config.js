const dotenv = require('dotenv').config()
const config = {
    apiBaseUrl : process.env.VITE_API_BASE_URL
}
module.exports = config