// src/ordersDataProvider.ts
import type { DataProvider } from "react-admin";

const API_URL = import.meta.env.VITE_API_URL;

async function http<T>(url: string, options: RequestInit = {}): Promise<T> {
    const res = await fetch(url, {
        headers: { "Content-Type": "application/json", ...(options.headers || {}) },
        ...options,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(`${res.status} ${res.statusText} - ${text}`);
    }
    return (await res.json()) as T;
}

function pickListPayload(json: any) {
    // OrderResponse thường là { content: [], totalElements: n, ... } (Spring Page)
    const items =
        json?.content ??
        json?.orders ??
        json?.data ??
        (Array.isArray(json) ? json : []);
    const total =
        json?.totalElements ??
        json?.total ??
        json?.count ??
        (Array.isArray(items) ? items.length : 0);

    return { items, total };
}

const mapId = (o: any) => ({ ...o, id: o.id ?? o.orderId });

export const ordersOnlyProvider: Pick<
    DataProvider,
    "getList" | "update"
> = {
    // React-Admin List Orders
    getList: async (_resource, params) => {
        const page = params.pagination?.page ?? 1;
        const perPage = params.pagination?.perPage ?? 10;

        const sortField = params.sort?.field ?? "orderId";
        const sortOrder = (params.sort?.order ?? "DESC").toLowerCase();

        const url =
            `${API_URL}/admin/orders` +
            `?pageNumber=${page - 1}` +
            `&pageSize=${perPage}` +
            `&sortBy=${encodeURIComponent(sortField)}` +
            `&sortOrder=${encodeURIComponent(sortOrder)}`;

        const json = await http<any>(url);
        const { items, total } = pickListPayload(json);

        return {
            data: (items ?? []).map(mapId),
            total,
        };
    },

    // Update status (RA update)
    update: async (_resource, params) => {
        // bạn cập nhật bằng emailId + orderId + orderStatus
        const emailId = (params.data as any)?.emailId ?? (params.data as any)?.email;
        const orderId = (params.data as any)?.orderId ?? params.id;
        const orderStatus = (params.data as any)?.orderStatus;

        if (!emailId) throw new Error("Thiếu emailId/email để update order");
        if (!orderStatus) throw new Error("Thiếu orderStatus để update order");

        const url = `${API_URL}/admin/users/${encodeURIComponent(
            emailId
        )}/orders/${orderId}/orderStatus/${encodeURIComponent(orderStatus)}`;

        const json = await http<any>(url, { method: "PUT" });
        return { data: mapId(json) };
    },
};