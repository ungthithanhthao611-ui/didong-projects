/**
 * ========================================
 * AUTH SERVICE - Quản lý xác thực người dùng
 * ========================================
 */

import AsyncStorage from "@react-native-async-storage/async-storage";
import { ENDPOINTS, STORAGE_KEYS } from "../config/api.config";

// ========================================
// TYPES
// ========================================
export interface UserInfo {
    id: number;
    name: string;
    email: string;
    role: string;
}

export interface LoginResponse {
    token: string;
    user: UserInfo;
}

// ========================================
// AUTH FUNCTIONS
// ========================================

/**
 * Đăng nhập và lưu token + user info
 */
export const login = async (email: string, password: string): Promise<LoginResponse> => {
    const response = await fetch(ENDPOINTS.login, {
        method: "POST",
        headers: {
            "Accept": "application/json",
            "Content-Type": "application/json",
        },
        body: JSON.stringify({ email, password }),
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Đăng nhập thất bại");
    }

    // Lưu token và user info vào AsyncStorage
    await AsyncStorage.setItem(STORAGE_KEYS.TOKEN, data.token);
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data.user));

    return data;
};

/**
 * Đăng xuất - xóa token và user info
 */
export const logout = async (): Promise<void> => {
    await AsyncStorage.removeItem(STORAGE_KEYS.TOKEN);
    await AsyncStorage.removeItem(STORAGE_KEYS.USER);
};

/**
 * Lấy token đã lưu
 */
export const getToken = async (): Promise<string | null> => {
    return await AsyncStorage.getItem(STORAGE_KEYS.TOKEN);
};

/**
 * Lấy thông tin user đã lưu
 */
export const getStoredUser = async (): Promise<UserInfo | null> => {
    const userJson = await AsyncStorage.getItem(STORAGE_KEYS.USER);
    if (userJson) {
        return JSON.parse(userJson);
    }
    return null;
};

/**
 * Lấy thông tin user từ server (sử dụng token)
 */
export const fetchCurrentUser = async (): Promise<UserInfo> => {
    const token = await getToken();

    if (!token) {
        throw new Error("Chưa đăng nhập");
    }

    const response = await fetch(ENDPOINTS.me, {
        method: "GET",
        headers: {
            "Accept": "application/json",
            "Authorization": `Bearer ${token}`,
        },
    });

    const data = await response.json();

    if (!response.ok) {
        throw new Error(data.message || "Không thể lấy thông tin người dùng");
    }

    // Cập nhật user info trong storage
    await AsyncStorage.setItem(STORAGE_KEYS.USER, JSON.stringify(data));

    return data;
};

/**
 * Kiểm tra đã đăng nhập chưa
 */
export const isLoggedIn = async (): Promise<boolean> => {
    const token = await getToken();
    return token !== null;
};
