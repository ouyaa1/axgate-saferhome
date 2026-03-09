package com.axgate.saferhome.controller;

import com.axgate.saferhome.entity.Report;
import com.axgate.saferhome.service.ReportService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 보고서 컨트롤러
 */
@RestController
@RequestMapping("/api/complexes/{complexId}/reports")
@RequiredArgsConstructor
public class ReportController {

    private final ReportService reportService;

    /**
     * GET /api/complexes/{complexId}/reports - 특정 단지의 보고서 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<Report>> getReports(@PathVariable String complexId) {
        return ResponseEntity.ok(reportService.getReportsByComplexId(complexId));
    }

    /**
     * POST /api/complexes/{complexId}/reports - 보고서 생성
     */
    @PostMapping
    public ResponseEntity<Report> createReport(
            @PathVariable String complexId,
            @RequestBody Report report) {
        Report created = reportService.createReport(complexId, report);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * DELETE /api/complexes/{complexId}/reports/{reportId} - 보고서 삭제
     */
    @DeleteMapping("/{reportId}")
    public ResponseEntity<Void> deleteReport(
            @PathVariable String complexId,
            @PathVariable String reportId) {
        reportService.deleteReport(reportId);
        return ResponseEntity.noContent().build();
    }
}
