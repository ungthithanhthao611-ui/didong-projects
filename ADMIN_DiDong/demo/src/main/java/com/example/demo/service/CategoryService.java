package com.example.demo.service;

import java.util.List;

import com.example.demo.entity.Category;

public interface CategoryService {

    void create(Category category);

    List<Category> getAll();

    void delete(Long id);
}
