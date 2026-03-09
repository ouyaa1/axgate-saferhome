package com.axgate.saferhome.controller;

import com.axgate.saferhome.entity.ComplexManagement;
import com.axgate.saferhome.service.ComplexManagementService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 단지관리 운영점검 컨트롤러
 */
@RestController
@RequestMapping("/api/complexes/{complexId}/complex-managements")
@RequiredArgsConstructor
public class ComplexManagementController {

    private final ComplexManagementService complexManagementService;

    /**
     * GET /api/complexes/{complexId}/complex-managements - 운영점검 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<ComplexManagement>> getManagements(@PathVariable String complexId) {
        return ResponseEntity.ok(complexManagementService.getManagementsByComplexId(complexId));
    }

    /**
     * PUT /api/complexes/{complexId}/complex-managements - 운영점검 결과 저장
     */
    @PutMapping
    public ResponseEntity<List<ComplexManagement>> saveManagements(
            @PathVariable String complexId,
            @RequestBody List<ComplexManagement> managements) {
        return ResponseEntity.ok(complexManagementService.saveManagements(complexId, managements));
    }
}
