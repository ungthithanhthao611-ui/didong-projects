package com.example.demo.repository;

import org.springframework.stereotype.Repository;

import com.example.demo.entity.ClassRoom;

import java.util.ArrayList;
import java.util.List;

@Repository
public class ClassRepository {

    private List<ClassRoom> classes = new ArrayList<>();
    private Long currentId = 1L;

    

    public List<ClassRoom> findAll() {
        return classes;
    }

    public ClassRoom findById(Long id) {
        return classes.stream().filter(c -> c.getId().equals(id)).findFirst().orElse(null);
    }

    public ClassRoom save(ClassRoom c) {
        c.setId(currentId++);
        classes.add(c);
        return c;
    }

    public ClassRoom update(Long id, ClassRoom updated) {
        ClassRoom c = findById(id);
        if (c != null) c.setName(updated.getName());
        return c;
    }

    public void delete(Long id) {
        classes.removeIf(c -> c.getId().equals(id));
    }
}
