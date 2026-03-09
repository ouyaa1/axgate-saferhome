package com.axgate.saferhome.repository;

import com.axgate.saferhome.entity.ComplexManagement;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplexManagementRepository extends JpaRepository<ComplexManagement, Long> {

    List<ComplexManagement> findByComplexIdOrderByCheckIdAsc(String complexId);

    void deleteByComplexId(String complexId);
}
