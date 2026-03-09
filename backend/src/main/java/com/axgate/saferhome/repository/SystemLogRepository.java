package com.axgate.saferhome.repository;

import com.axgate.saferhome.entity.SystemLog;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SystemLogRepository extends JpaRepository<SystemLog, Long> {

    List<SystemLog> findAllByOrderByCreatedAtDesc();

    List<SystemLog> findByLevel(String level);
}
