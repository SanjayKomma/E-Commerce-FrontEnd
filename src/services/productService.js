import api from './api';
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
    },
    createProduct: async(productData) => {
        const response = await api.post('/products/create',productData);
        return response.data;
    },
    updateProduct: async(id, productData) => {
        const response = await api.put(`/products/${id}`,productData);
        return response.data;
    },
    deleteProduct: async(id) => {
        const response = await api.delete(`/products/${id}`);
        return response.data;
    },
    getSellerProducts: async () => {
        const response = await api.get('/products/seller/mine');
        return response.data;
    },
}
export default productService;