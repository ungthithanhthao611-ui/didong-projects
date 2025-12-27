package com.example.demo.repository;

import org.springframework.stereotype.Repository;

import com.example.demo.entity.Student;

import java.util.ArrayList;
import java.util.List;

@Repository
public class StudentRepository {

    private List<Student> students = new ArrayList<>();
    private Long currentId = 1L;

    

    public List<Student> findAll() {
        return students;
    }

    public Student findById(Long id) {
        return students.stream().filter(s -> s.getId().equals(id)).findFirst().orElse(null);
    }

    public Student save(Student s) {
        s.setId(currentId++);
        students.add(s);
        return s;
    }

    public List<Student> saveAll(List<Student> list) {
        for (Student s : list) {
            s.setId(currentId++);
            students.add(s);
        }
        return list;
    }

    public Student update(Long id, Student updated) {
        Student s = findById(id);
        if (s != null) {
            s.setName(updated.getName());
            s.setAge(updated.getAge());
            s.setEmail(updated.getEmail());
            s.setAddress(updated.getAddress());
            s.setGpa(updated.getGpa());
            s.setClassId(updated.getClassId());
        }
        return s;
    }

    public void delete(Long id) {
        students.removeIf(s -> s.getId().equals(id));
    }
}
