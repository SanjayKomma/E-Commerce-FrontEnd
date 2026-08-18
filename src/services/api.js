const config = require('../utils/config')
const axios = require('axios')
const api = axios.create({
    baseURL : `${process.env.VITE_API_BASE_URL}`,
    headers : {
        'Content-Type' : 'application/json'
    },
    withCredentials : true
});
module.exports = api