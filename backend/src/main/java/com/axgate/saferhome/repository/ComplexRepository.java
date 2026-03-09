package com.axgate.saferhome.repository;

import com.axgate.saferhome.entity.Complex;
import org.springframework.data.jpa.repository.JpaRepository;
import org.springframework.stereotype.Repository;

import java.util.List;

@Repository
public interface ComplexRepository extends JpaRepository<Complex, String> {

    List<Complex> findByRegion(String region);

    List<Complex> findByStatus(String status);

    List<Complex> findByNameContaining(String name);
}
