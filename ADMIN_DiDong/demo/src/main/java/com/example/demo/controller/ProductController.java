package com.example.demo.controller;

import com.example.demo.entity.Product;
import com.example.demo.service.ProductService;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.List;

@RestController
@RequestMapping("/api/products")
@CrossOrigin(origins = "http://localhost:5173", exposedHeaders = "Content-Range")
public class ProductController {

    private final ProductService service;

    public ProductController(ProductService service) {
        this.service = service;
    }

    @GetMapping
    public ResponseEntity<List<Product>> getActive(@RequestParam(required = false) Long categoryId) {
        List<Product> products = service.getActive(categoryId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "products 0-" + products.size() + "/" + products.size());
        headers.add("Access-Control-Expose-Headers", "Content-Range");
        return ResponseEntity.ok().headers(headers).body(products);
    }

    @GetMapping("/search")
    public ResponseEntity<List<Product>> search(@RequestParam("q") String q,
            @RequestParam(required = false) Long categoryId) {
        List<Product> products = service.search(q, categoryId);
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "products 0-" + products.size() + "/" + products.size());
        headers.add("Access-Control-Expose-Headers", "Content-Range");
        return ResponseEntity.ok().headers(headers).body(products);
    }

    @GetMapping("/{id}/related")
    public List<Product> getRelated(@PathVariable Long id, @RequestParam Long categoryId) {
        return service.getRelated(id, categoryId);
    }

    @GetMapping("/{id}")
    public Product getById(@PathVariable Long id) {
        return service.getById(id);
    }

    @PostMapping
    public ResponseEntity<Product> create(
            @RequestParam(value = "image", required = false) MultipartFile image,
            @RequestParam("title") String title,
            @RequestParam("slug") String slug,
            @RequestParam(value = "description", required = false) String description,
            @RequestParam("price") double price,
            @RequestParam(value = "price_root", defaultValue = "0") double priceRoot,
            @RequestParam("qty") int qty,
            @RequestParam(value = "categoryId", required = false) Long categoryId) throws IOException {
        Product p = new Product();
        p.setTitle(title);
        p.setSlug(slug);
        p.setDescription(description);
        p.setPrice(price);
        p.setPriceRoot(priceRoot);
        p.setQty(qty);
        p.setCategoryId(categoryId);

        Product savedProduct = service.create(p, image);
        return ResponseEntity.ok(savedProduct);
    }

    // ✅ UPDATE: Đã sửa trả về ResponseEntity<Product>
    @PutMapping("/{id}")
    public ResponseEntity<Product> update(@PathVariable Long id, @RequestBody Product p) {
        Product updatedProduct = service.update(id, p);
        return ResponseEntity.ok(updatedProduct);
    }

    @DeleteMapping("/{id}")
    public void softDelete(@PathVariable Long id) {
        service.delete(id);
    }

    @GetMapping("/trash")
    public List<Product> getTrash() {
        return service.getTrash();
    }

    @PutMapping("/{id}/restore")
    public void restore(@PathVariable Long id) {
        service.restore(id);
    }

    @DeleteMapping("/{id}/force")
    public void forceDelete(@PathVariable Long id) {
        service.forceDelete(id);
    }
}