package com.example.demo.controller;

import com.example.demo.entity.ClassRoom;
import com.example.demo.entity.Student;
import com.example.demo.service.ClassService;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.util.List;

@RestController
@RequestMapping("/api/classes")
public class ClassController {

    @Autowired
    private ClassService service;

    // 🟢 Lấy tất cả lớp
    @GetMapping
    public List<ClassRoom> getAllClasses() {
        return service.getAllClasses();
    }

    // 🟢 Lấy chi tiết lớp
    @GetMapping("/{id}")
    public ClassRoom getClassById(@PathVariable Long id) {
        return service.getClassById(id);
    }

    // 🟢 Thêm lớp
    @PostMapping
    public ClassRoom addClass(@RequestBody ClassRoom c) {
        return service.addClass(c);
    }

    // 🟢 Sửa lớp
    @PutMapping("/{id}")
    public ClassRoom updateClass(@PathVariable Long id, @RequestBody ClassRoom updated) {
        return service.updateClass(id, updated);
    }

    // 🟢 Xóa lớp
    @DeleteMapping("/{id}")
    public void deleteClass(@PathVariable Long id) {
        service.deleteClass(id);
    }

    // ⭐ Lấy danh sách sinh viên trong lớp
    @GetMapping("/{id}/students")
    public List<Student> getStudentsInClass(@PathVariable Long id) {
        return service.getStudentsInClass(id);
    }
}
