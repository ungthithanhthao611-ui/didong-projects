package com.example.demo.controller;

import com.example.demo.entity.Category;
import com.example.demo.repository.CategoryRepository;
import org.springframework.http.HttpHeaders;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/categories")
@CrossOrigin(origins = {"http://localhost:5173", "http://localhost:8081"}, exposedHeaders = "Content-Range")
public class CategoryController {

    private final CategoryRepository repo;

    public CategoryController(CategoryRepository repo) {
        this.repo = repo;
    }

    // GET ALL
    @GetMapping
    public ResponseEntity<List<Category>> getAll() {
        List<Category> list = repo.findAll();
        HttpHeaders headers = new HttpHeaders();
        headers.add("Content-Range", "categories 0-" + list.size() + "/" + list.size());
        headers.add("Access-Control-Expose-Headers", "Content-Range");
        return ResponseEntity.ok().headers(headers).body(list);
    }

    // GET BY ID
    @GetMapping("/{id}")
    public Category getById(@PathVariable Long id) {
        Category cat = repo.findById(id);
        if (cat == null) throw new RuntimeException("Not found id: " + id);
        return cat;
    }

    // 🔥 [QUAN TRỌNG] CREATE: PHẢI TRẢ VỀ JSON CÓ ID
    @PostMapping
    public ResponseEntity<Category> create(@RequestBody Category cat) {
        // 1. Lưu xuống DB và lấy lại object có ID
        Category savedCat = repo.save(cat);
        
        // 2. Trả về cho Frontend
        return ResponseEntity.ok(savedCat);
    }

    // 🔥 UPDATE: NÊN TRẢ VỀ JSON LUÔN
    @PutMapping("/{id}")
    public ResponseEntity<Category> update(@PathVariable Long id, @RequestBody Category cat) {
        Category updatedCat = repo.update(id, cat);
        return ResponseEntity.ok(updatedCat);
    }

    // DELETE
    @DeleteMapping("/{id}")
    public void delete(@PathVariable Long id) {
        repo.delete(id);
    }
}