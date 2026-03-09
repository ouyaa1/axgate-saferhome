package com.axgate.saferhome.service;

import com.axgate.saferhome.entity.SafetyInspection;
import com.axgate.saferhome.repository.SafetyInspectionRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 안전점검 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class SafetyInspectionService {

    private final SafetyInspectionRepository safetyInspectionRepository;

    /**
     * 특정 단지의 안전점검 목록 조회
     */
    @Transactional(readOnly = true)
    public List<SafetyInspection> getInspectionsByComplexId(String complexId) {
        return safetyInspectionRepository.findByComplexIdOrderByCheckIdAsc(complexId);
    }

    /**
     * 안전점검 결과 일괄 저장 (기존 데이터 삭제 후 새로 저장)
     */
    @Transactional
    public List<SafetyInspection> saveInspections(String complexId, List<SafetyInspection> inspections) {
        // 기존 데이터 삭제
        safetyInspectionRepository.deleteByComplexId(complexId);

        // 단지 ID 설정 후 저장
        inspections.forEach(inspection -> {
            inspection.setId(null);
            inspection.setComplexId(complexId);
        });

        List<SafetyInspection> saved = safetyInspectionRepository.saveAll(inspections);
        log.info("안전점검 저장 완료 - 단지: {}, 항목 수: {}", complexId, saved.size());
        return saved;
    }
}
