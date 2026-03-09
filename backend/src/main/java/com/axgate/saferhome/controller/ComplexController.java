package com.axgate.saferhome.controller;

import com.axgate.saferhome.dto.ComplexDto;
import com.axgate.saferhome.service.ComplexService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 단지 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/complexes")
@RequiredArgsConstructor
public class ComplexController {

    private final ComplexService complexService;

    /**
     * GET /api/complexes - 전체 단지 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<ComplexDto>> getAllComplexes() {
        return ResponseEntity.ok(complexService.getAllComplexes());
    }

    /**
     * GET /api/complexes/{id} - 단지 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<ComplexDto> getComplex(@PathVariable String id) {
        return ResponseEntity.ok(complexService.getComplex(id));
    }

    /**
     * POST /api/complexes - 단지 등록
     */
    @PostMapping
    public ResponseEntity<ComplexDto> createComplex(@RequestBody ComplexDto dto) {
        ComplexDto created = complexService.createComplex(dto);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/complexes/{id} - 단지 정보 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<ComplexDto> updateComplex(@PathVariable String id, @RequestBody ComplexDto dto) {
        return ResponseEntity.ok(complexService.updateComplex(id, dto));
    }

    /**
     * DELETE /api/complexes/{id} - 단지 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteComplex(@PathVariable String id) {
        complexService.deleteComplex(id);
        return ResponseEntity.noContent().build();
    }
}
