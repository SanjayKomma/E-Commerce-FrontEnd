import api from './api';
const orderService = {
    createOrder : async(orderData) => {
        const response = await api.post('/orders/create',orderData);
        return response.data;
    },
    getMyOrders : async() => {
        const response = await api.get('/orders');
        return response.data;
    },
    getOrderById : async(id) => {
        const response = await api.get(`/orders/${id}`);
        return response.data;
    },
    getSellerOrders: async() => {
        const response = await api.get('/orders/seller/orders');
        return response.data;
    },
    updateShipmentStatus: async(orderId, productId, payload) => {
        const response = await api.put(`/orders/${orderId}/items/${productId}/status`, payload);
        return response.data;
    }
}
export default orderService;