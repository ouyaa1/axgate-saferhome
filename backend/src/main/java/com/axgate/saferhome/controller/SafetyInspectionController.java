package com.axgate.saferhome.controller;

import com.axgate.saferhome.entity.SafetyInspection;
import com.axgate.saferhome.service.SafetyInspectionService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 안전점검 컨트롤러
 */
@RestController
@RequestMapping("/api/complexes/{complexId}/safety-inspections")
@RequiredArgsConstructor
public class SafetyInspectionController {

    private final SafetyInspectionService safetyInspectionService;

    /**
     * GET /api/complexes/{complexId}/safety-inspections - 안전점검 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<SafetyInspection>> getInspections(@PathVariable String complexId) {
        return ResponseEntity.ok(safetyInspectionService.getInspectionsByComplexId(complexId));
    }

    /**
     * PUT /api/complexes/{complexId}/safety-inspections - 안전점검 결과 저장
     */
    @PutMapping
    public ResponseEntity<List<SafetyInspection>> saveInspections(
            @PathVariable String complexId,
            @RequestBody List<SafetyInspection> inspections) {
        return ResponseEntity.ok(safetyInspectionService.saveInspections(complexId, inspections));
    }
}
