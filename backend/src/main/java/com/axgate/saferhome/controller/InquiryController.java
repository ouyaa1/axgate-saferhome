package com.axgate.saferhome.controller;

import com.axgate.saferhome.entity.Inquiry;
import com.axgate.saferhome.repository.InquiryRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 문의 컨트롤러
 */
@RestController
@RequestMapping("/api/inquiries")
@RequiredArgsConstructor
public class InquiryController {

    private final InquiryRepository inquiryRepository;

    /**
     * GET /api/inquiries - 전체 문의 목록 조회 (최신순)
     */
    @GetMapping
    public ResponseEntity<List<Inquiry>> getAllInquiries() {
        return ResponseEntity.ok(inquiryRepository.findAllByOrderByCreatedAtDesc());
    }

    /**
     * POST /api/inquiries - 문의 등록
     */
    @PostMapping
    public ResponseEntity<Inquiry> createInquiry(@RequestBody Inquiry inquiry) {
        Inquiry saved = inquiryRepository.save(inquiry);
        return ResponseEntity.status(HttpStatus.CREATED).body(saved);
    }

    /**
     * PUT /api/inquiries/{id} - 문의 답변 등록
     */
    @PutMapping("/{id}")
    public ResponseEntity<Inquiry> answerInquiry(@PathVariable Long id, @RequestBody Inquiry inquiryData) {
        Inquiry inquiry = inquiryRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("문의를 찾을 수 없습니다: " + id));

        inquiry.setAnswer(inquiryData.getAnswer());
        inquiry.setStatus("답변완료");

        return ResponseEntity.ok(inquiryRepository.save(inquiry));
    }
}
