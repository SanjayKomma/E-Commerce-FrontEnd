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
}
export default orderService;