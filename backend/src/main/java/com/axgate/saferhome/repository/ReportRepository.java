package com.axgate.saferhome.repository;

import com.axgate.saferhome.entity.Report;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ReportRepository extends JpaRepository<Report, String> {

    List<Report> findByComplexIdOrderByDateDesc(String complexId);

    List<Report> findByType(String type);
}
