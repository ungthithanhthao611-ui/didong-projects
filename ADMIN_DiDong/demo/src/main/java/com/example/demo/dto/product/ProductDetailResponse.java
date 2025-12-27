package com.example.demo.dto.product;

import com.example.demo.entity.Product;
import com.example.demo.entity.ProductImage;

import java.util.List;

public class ProductDetailResponse {

    private Product product;
    private List<ProductImage> images;

    public ProductDetailResponse() {}

    public ProductDetailResponse(Product product, List<ProductImage> images) {
        this.product = product;
        this.images = images;
    }

    public Product getProduct() {
        return product;
    }

    public void setProduct(Product product) {
        this.product = product;
    }

    public List<ProductImage> getImages() {
        return images;
    }

    public void setImages(List<ProductImage> images) {
        this.images = images;
    }
}
