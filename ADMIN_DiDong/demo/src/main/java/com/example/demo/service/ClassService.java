package com.example.demo.service;

import com.example.demo.entity.ClassRoom;
import com.example.demo.entity.Student;
import com.example.demo.repository.ClassRepository;
import com.example.demo.repository.StudentRepository;

import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class ClassService {

    @Autowired
    private ClassRepository classRepository;

    @Autowired
    private StudentRepository studentRepository;

    public List<ClassRoom> getAllClasses() {
        return classRepository.findAll();
    }

    public ClassRoom getClassById(Long id) {
        return classRepository.findById(id);
    }

    public ClassRoom addClass(ClassRoom c) {
        return classRepository.save(c);
    }

    public ClassRoom updateClass(Long id, ClassRoom updated) {
        return classRepository.update(id, updated);
    }

    public void deleteClass(Long id) {
        classRepository.delete(id);
    }

    // ⭐ Tìm sinh viên trong lớp
    public List<Student> getStudentsInClass(Long classId) {
        return studentRepository.findAll()
                .stream()
                .filter(s -> s.getClassId() != null && s.getClassId().equals(classId))
                .collect(Collectors.toList());
    }
}
