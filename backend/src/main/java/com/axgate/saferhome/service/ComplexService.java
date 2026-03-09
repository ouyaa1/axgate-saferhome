package com.axgate.saferhome.service;

import com.axgate.saferhome.dto.ComplexDto;
import com.axgate.saferhome.entity.Complex;
import com.axgate.saferhome.repository.ComplexRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;
import java.util.stream.Collectors;

/**
 * 단지 관리 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class ComplexService {

    private final ComplexRepository complexRepository;

    /**
     * 전체 단지 목록 조회
     */
    @Transactional(readOnly = true)
    public List<ComplexDto> getAllComplexes() {
        return complexRepository.findAll().stream()
                .map(ComplexDto::fromEntity)
                .collect(Collectors.toList());
    }

    /**
     * 단지 상세 조회
     */
    @Transactional(readOnly = true)
    public ComplexDto getComplex(String id) {
        Complex complex = complexRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("단지를 찾을 수 없습니다: " + id));
        return ComplexDto.fromEntity(complex);
    }

    /**
     * 단지 등록
     */
    @Transactional
    public ComplexDto createComplex(ComplexDto dto) {
        if (complexRepository.existsById(dto.getId())) {
            throw new RuntimeException("이미 존재하는 단지 ID입니다: " + dto.getId());
        }
        Complex saved = complexRepository.save(dto.toEntity());
        log.info("단지 등록 완료: {}", saved.getId());
        return ComplexDto.fromEntity(saved);
    }

    /**
     * 단지 정보 수정
     */
    @Transactional
    public ComplexDto updateComplex(String id, ComplexDto dto) {
        Complex existing = complexRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("단지를 찾을 수 없습니다: " + id));

        // 수정 가능한 필드 업데이트
        existing.setName(dto.getName());
        existing.setRegion(dto.getRegion());
        existing.setBuilder(dto.getBuilder());
        existing.setHomenet(dto.getHomenet());
        existing.setStatus(dto.getStatus());
        existing.setAddress(dto.getAddress());
        existing.setManager(dto.getManager());
        existing.setContact(dto.getContact());
        existing.setReport(dto.getReport());
        existing.setRegistrant(dto.getRegistrant());
        existing.setBuilderManager(dto.getBuilderManager());
        existing.setBuilderContact(dto.getBuilderContact());
        existing.setHomenetManager(dto.getHomenetManager());
        existing.setHomenetContact(dto.getHomenetContact());
        existing.setDongCount(dto.getDongCount());
        existing.setDongStartNum(dto.getDongStartNum());
        existing.setFloorCount(dto.getFloorCount());
        existing.setUnitsPerFloor(dto.getUnitsPerFloor());
        existing.setDeviceRegistered(dto.getDeviceRegistered());

        Complex saved = complexRepository.save(existing);
        log.info("단지 수정 완료: {}", saved.getId());
        return ComplexDto.fromEntity(saved);
    }

    /**
     * 단지 삭제
     */
    @Transactional
    public void deleteComplex(String id) {
        if (!complexRepository.existsById(id)) {
            throw new RuntimeException("단지를 찾을 수 없습니다: " + id);
        }
        complexRepository.deleteById(id);
        log.info("단지 삭제 완료: {}", id);
    }
}
