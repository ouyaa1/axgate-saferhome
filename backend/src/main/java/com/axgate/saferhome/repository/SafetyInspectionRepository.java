package com.axgate.saferhome.repository;

import com.axgate.saferhome.entity.SafetyInspection;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface SafetyInspectionRepository extends JpaRepository<SafetyInspection, Long> {

    List<SafetyInspection> findByComplexIdOrderByCheckIdAsc(String complexId);

    void deleteByComplexId(String complexId);
}
