package com.app.server.repository;

import com.app.server.entity.User;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.Optional;

public interface UserRepository extends JpaRepository<User, Integer> {
    Optional<User> findById(int id);
    Optional<User> findByUsernameIgnoreCase(String username);
}