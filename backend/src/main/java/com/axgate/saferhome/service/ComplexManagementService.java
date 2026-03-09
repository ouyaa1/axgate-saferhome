package com.axgate.saferhome.service;

import com.axgate.saferhome.entity.ComplexManagement;
import com.axgate.saferhome.repository.ComplexManagementRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 단지관리 운영점검 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ComplexManagementService {

    private final ComplexManagementRepository complexManagementRepository;

    /**
     * 특정 단지의 운영점검 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ComplexManagement> getManagementsByComplexId(String complexId) {
        return complexManagementRepository.findByComplexIdOrderByCheckIdAsc(complexId);
    }

    /**
     * 운영점검 결과 일괄 저장 (기존 데이터 삭제 후 새로 저장)
     */
    @Transactional
    public List<ComplexManagement> saveManagements(String complexId, List<ComplexManagement> managements) {
        // 기존 데이터 삭제
        complexManagementRepository.deleteByComplexId(complexId);

        // 단지 ID 설정 후 저장
        managements.forEach(management -> {
            management.setId(null);
            management.setComplexId(complexId);
        });

        List<ComplexManagement> saved = complexManagementRepository.saveAll(managements);
        log.info("단지관리 운영점검 저장 완료 - 단지: {}, 항목 수: {}", complexId, saved.size());
        return saved;
    }
}
