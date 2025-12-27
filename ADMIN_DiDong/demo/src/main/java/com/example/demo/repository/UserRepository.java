package com.example.demo.repository;

import com.example.demo.entity.User;
import org.springframework.jdbc.core.JdbcTemplate;
import org.springframework.jdbc.core.RowMapper;
import org.springframework.stereotype.Repository;

import java.util.List;
import java.util.Optional;

@Repository
public class UserRepository {

    private final JdbcTemplate jdbcTemplate;

    public UserRepository(JdbcTemplate jdbcTemplate) {
        this.jdbcTemplate = jdbcTemplate;
    }

    private final RowMapper<User> mapper = (rs, rowNum) -> {
        User u = new User();
        u.setId(rs.getLong("id"));
        u.setName(rs.getString("name"));
        u.setEmail(rs.getString("email"));
        u.setPassword(rs.getString("password"));
        try {
            u.setRole(rs.getString("role"));
        } catch (Exception e) {
            u.setRole("USER");
        }
        return u;
    };

    public Optional<User> findByEmail(String email) {
        try {
            User user = jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE email = ?",
                    mapper,
                    email
            );
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public Optional<User> findById(Long id) {
        try {
            User user = jdbcTemplate.queryForObject(
                    "SELECT * FROM users WHERE id = ?",
                    mapper,
                    id
            );
            return Optional.ofNullable(user);
        } catch (Exception e) {
            return Optional.empty();
        }
    }

    public List<User> findAll() {
        return jdbcTemplate.query("SELECT * FROM users ORDER BY id DESC", mapper);
    }

    public void save(String name, String email, String password, String role) {
        String safeRole = (role == null || role.isBlank()) ? "USER" : role;
        jdbcTemplate.update(
                "INSERT INTO users(name, email, password, role) VALUES (?,?,?,?)",
                name, email, password, safeRole
        );
    }

    public void updateRole(Long id, String role) {
        String safeRole = (role == null || role.isBlank()) ? "USER" : role;
        jdbcTemplate.update("UPDATE users SET role=? WHERE id=?", safeRole, id);
    }

    public void deleteById(Long id) {
        jdbcTemplate.update("DELETE FROM users WHERE id=?", id);
    }
}
