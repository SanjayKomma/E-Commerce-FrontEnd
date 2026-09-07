import api from "./api";
 const paymentService = {
    createRazorOrder : async (amount) => {
       const response = await api.post("/payment/create-order", {amount});
       return response.data;
    },
    verifyRazorPayment : async(paymentData) => {
        const response = await api.post("/payment/verify", {paymentData});
        return response.data;
    }
 }
 export default paymentService;