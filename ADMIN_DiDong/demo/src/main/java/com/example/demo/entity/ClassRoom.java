package com.example.demo.entity;

public class ClassRoom {
    private Long id;
    private String name;

    public ClassRoom() {}

    public ClassRoom(Long id, String name) {
        this.id = id;
        this.name = name;
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
}
