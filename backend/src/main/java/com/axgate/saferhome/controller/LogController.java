package com.axgate.saferhome.controller;

import com.axgate.saferhome.entity.SystemLog;
import com.axgate.saferhome.repository.SystemLogRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 시스템 로그 컨트롤러
 */
@RestController
@RequestMapping("/api/logs")
@RequiredArgsConstructor
public class LogController {

    private final SystemLogRepository systemLogRepository;

    /**
     * GET /api/logs - 전체 시스템 로그 조회 (최신순)
     */
    @GetMapping
    public ResponseEntity<List<SystemLog>> getAllLogs() {
        return ResponseEntity.ok(systemLogRepository.findAllByOrderByCreatedAtDesc());
    }
}
