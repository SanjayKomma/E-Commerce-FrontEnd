const api = require('./api');
const productService = {
    getAllProducts : async() => {
        const response = await api.get('/products');
        return response.data;
    },
    getProductById : async(id) => {
        const response = await api.get(`/products/${id}`);
        return response.data;
    },
    getProducts: async(params={}) => {
        const response = await api.get('/products',{params});
        return response.data;
    }
}
module.exports = productService;