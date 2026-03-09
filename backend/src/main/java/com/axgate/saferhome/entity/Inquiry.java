package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 문의 엔티티
 */
@Entity
@Table(name = "inquiry")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Inquiry {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title; // 제목

    @Column(columnDefinition = "TEXT")
    private String content; // 내용

    @Column(length = 50)
    private String author; // 작성자

    @Column(length = 20)
    private String status; // 상태 (대기 / 답변완료)

    @Column
    private LocalDateTime createdAt; // 작성일시

    @Column(columnDefinition = "TEXT")
    private String answer; // 답변

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
        if (this.status == null) {
            this.status = "대기";
        }
    }
}
