package com.axgate.saferhome.service;

import com.axgate.saferhome.entity.Report;
import com.axgate.saferhome.repository.ReportRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 보고서 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ReportService {

    private final ReportRepository reportRepository;

    /**
     * 특정 단지의 보고서 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Report> getReportsByComplexId(String complexId) {
        return reportRepository.findByComplexIdOrderByDateDesc(complexId);
    }

    /**
     * 전체 보고서 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Report> getAllReports() {
        return reportRepository.findAll();
    }

    /**
     * 보고서 생성
     */
    @Transactional
    public Report createReport(String complexId, Report report) {
        report.setComplexId(complexId);
        Report saved = reportRepository.save(report);
        log.info("보고서 생성 완료: {}", saved.getId());
        return saved;
    }

    /**
     * 보고서 삭제
     */
    @Transactional
    public void deleteReport(String reportId) {
        if (!reportRepository.existsById(reportId)) {
            throw new RuntimeException("보고서를 찾을 수 없습니다: " + reportId);
        }
        reportRepository.deleteById(reportId);
        log.info("보고서 삭제 완료: {}", reportId);
    }
}
