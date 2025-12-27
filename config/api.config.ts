/**
 * ========================================
 * CẤU HÌNH API CHO ỨNG DỤNG
 * ========================================
 * Thay đổi BASE_URL khi deploy lên server thực
 */

// Thay IP này bằng IP máy tính của bạn
export const API_BASE_URL = "http://10.217.155.87:8080/api";

// ========================================
// ENDPOINTS
// ========================================
export const ENDPOINTS = {
    // Auth
    register: `${API_BASE_URL}/auth/register`,
    login: `${API_BASE_URL}/auth/login`,
    me: `${API_BASE_URL}/auth/me`,

    // Products
    products: `${API_BASE_URL}/products`,

    // Categories
    categories: `${API_BASE_URL}/categories`,

    // Cart
    cart: `${API_BASE_URL}/cart`,

    // Orders
    orders: `${API_BASE_URL}/orders`,
};

// ========================================
// ASYNC STORAGE KEYS
// ========================================
export const STORAGE_KEYS = {
    TOKEN: "auth_token",
    USER: "user_info",
};
