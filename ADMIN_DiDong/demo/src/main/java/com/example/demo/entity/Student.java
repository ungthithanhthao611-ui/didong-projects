package com.example.demo.entity;

public class Student {
    private Long id;
    private String name;
    private int age;
    private String email;
    private String address;
    private double gpa;
    private Long classId; // liên kết lớp

    public Student() {}

    public Student(Long id, String name, int age, String email, String address, double gpa, Long classId) {
        this.id = id;
        this.name = name;
        this.age = age;
        this.email = email;
        this.address = address;
        this.gpa = gpa;
        this.classId = classId;
    }

    // ⭐ GETTERS & SETTERS ⭐
    public Long getId() {
        return id;
    }

    public void setId(Long id) {
        this.id = id;
    }

    public String getName() {
        return name;
    }

    public void setName(String name) {
        this.name = name;
    }

    public int getAge() {
        return age;
    }

    public void setAge(int age) {
        this.age = age;
    }

    public String getEmail() {
        return email;
    }

    public void setEmail(String email) {
        this.email = email;
    }

    public String getAddress() {
        return address;
    }

    public void setAddress(String address) {
        this.address = address;
    }

    public double getGpa() {
        return gpa;
    }

    public void setGpa(double gpa) {
        this.gpa = gpa;
    }

    public Long getClassId() {
        return classId;
    }

    public void setClassId(Long classId) {
        this.classId = classId;
    }
}
