package com.example.demo.service;

import com.example.demo.entity.Student;
import com.example.demo.repository.StudentRepository;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.stereotype.Service;

import java.util.List;
import java.util.stream.Collectors;

@Service
public class StudentService {

    @Autowired
    private StudentRepository repository;

    public List<Student> getAllStudents() {
        return repository.findAll();
    }

    public Student getStudentById(Long id) {
        return repository.findById(id);
    }

    public Student addStudent(Student newStudent) {
        return repository.save(newStudent);
    }

    public List<Student> addManyStudents(List<Student> list) {
        return repository.saveAll(list);
    }

    public Student updateStudent(Long id, Student updatedStudent) {
        return repository.update(id, updatedStudent);
    }

    public void deleteStudent(Long id) {
        repository.delete(id);
    }

    // ⭐ Lọc theo GPA
    public List<Student> filterByGpa(double min) {
        return repository.findAll()
                .stream()
                .filter(s -> s.getGpa() >= min)
                .collect(Collectors.toList());
    }

    // ⭐ Tìm sinh viên theo classId
    public List<Student> findStudentsOfClass(Long classId) {
        return repository.findAll()
                .stream()
                .filter(s -> s.getClassId() != null && s.getClassId().equals(classId))
                .collect(Collectors.toList());
    }
}
