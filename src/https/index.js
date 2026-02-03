import axios from "axios";

export const api = axios.create({
    baseURL: "http://localhost:8000", 
    withCredentials: true,
    headers: { "Content-Type": "application/json", Accept: "application/json" }
});

api.interceptors.request.use(
    (config) => {
        const userInfoString = localStorage.getItem('userInfo');
        if (userInfoString) {
            const userInfo = JSON.parse(userInfoString);
            const token = userInfo?.token;
            if (token) {
                config.headers['Authorization'] = `Bearer ${token}`;
            }
        }
        return config;
    },
    (error) => Promise.reject(error)
);

// USER AUTH
export const login = (data) => api.post("/api/user/login", data);
export const register = (data) => api.post("/api/user/register", data);
export const getUserData = () => api.get("/api/user");
export const logout = () => api.post("/api/user/logout");

// === ORDER API ===
export const getAllOrders = () => api.get("/api/orders"); 
export const addOrder = (orderData) => api.post("/api/orders", orderData); 
export const updateOrderStatus = ({ orderId, status }) => api.put(`/api/orders/${orderId}`, { orderStatus: status });

// === ANALYTICS & AUDIT ===
export const getAnalytics = () => api.get("/api/data/analytics/dashboard");
export const getAuditLogs = () => api.get("/api/audit"); // <--- NEW API FOR AUDIT PAGE

// === MENU API ENDPOINTS ===
// 🚨 DUAL EXPORT TO FIX CRASH IN DATA.JSX AND HOME.JSX 🚨
const fetchMenusRequest = () => api.get("/api/menu");

export const getAllMenus = fetchMenusRequest; // For Data.jsx
export const getMenus = fetchMenusRequest;    // For Home.jsx

export const addCategory = (data) => api.post("/api/menu/category", data);
export const deleteCategory = (id) => api.delete(`/api/menu/category/${id}`);
export const addItemToCategory = ({ categoryId, name, price }) => api.post(`/api/menu/category/${categoryId}/items`, { name, price });
export const deleteItemFromCategory = ({ categoryId, itemId }) => api.delete(`/api/menu/category/${categoryId}/items/${itemId}`);

// USER MANAGEMENT API
export const getAllUsers = () => api.get("/api/user/all");
export const deleteUser = (userId) => api.delete(`/api/user/${userId}`);
export const updateUserRole = ({ userId, role }) => api.put(`/api/user/role/${userId}`, { role });

// DATA/DASHBOARD API
export const getDashboardStats = () => api.get("/api/data/stats");
export const logAuditAction = (action, details) => api.post("/api/audit", { action, details });

export default api;