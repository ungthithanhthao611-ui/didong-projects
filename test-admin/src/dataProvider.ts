import simpleRestProvider from "ra-data-simple-rest";
import { fetchUtils, DataProvider } from "react-admin";

const apiUrl = "http://localhost:8080/api";
const httpClient = fetchUtils.fetchJson;

const baseDataProvider = simpleRestProvider(apiUrl, httpClient);

export const dataProvider: DataProvider = {
    ...baseDataProvider,

    // Ghi đè hàm CREATE để xử lý upload ảnh cho Products
    create: (resource, params) => {
        if (resource === "products") {
            const formData = new FormData();
            
            // 1. Lấy file ảnh từ input (nếu có)
            if (params.data.image && params.data.image.rawFile) {
                formData.append("image", params.data.image.rawFile);
            }

            // 2. Map các trường dữ liệu khác sang FormData
            formData.append("title", params.data.title);
            formData.append("slug", params.data.slug);
            formData.append("description", params.data.description || "");
            formData.append("price", params.data.price);
            formData.append("price_root", params.data.price_root || 0);
            formData.append("qty", params.data.qty);
            formData.append("categoryId", params.data.categoryId);

            // 3. Gửi request dạng Multipart
            return httpClient(`${apiUrl}/${resource}`, {
                method: "POST",
                body: formData,
            }).then(({ json }) => ({
                data: { ...params.data, id: json.id },
            }));
        }

        // Các resource khác (Categories, Users...) dùng mặc định
        return baseDataProvider.create(resource, params);
    },
};