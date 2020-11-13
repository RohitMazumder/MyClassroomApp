package com.rohit.myclassroom.repository;

import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rohit.myclassroom.models.User;

@Repository
public interface UserRepository extends JpaRepository<User, Long> {
	public Optional<User> findByUsername(String username);
	public Optional<User> findById(Long id);
	public Boolean existsByUsername(String username);
	public Boolean existsByEmail(String email);
}
