package com.rohit.myclassroom.repository;

import java.util.List;
import java.util.Optional;

import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import com.rohit.myclassroom.models.Classroom;

@Repository
public interface ClassroomRepository extends JpaRepository<Classroom, Long> {
	public Boolean existsByUid(String uid);
	public Optional<Classroom> findByUid(String uid);
	public List<Classroom> findByAdminId(Long adminId);
}
