package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 공지사항 엔티티
 */
@Entity
@Table(name = "notice")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Notice {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 200)
    private String title; // 제목

    @Column(columnDefinition = "TEXT")
    private String content; // 내용

    @Column(length = 20)
    private String type; // 유형 (긴급 / 일반 / 업데이트)

    @Column
    private LocalDateTime createdAt; // 작성일시

    @Column(length = 50)
    private String author; // 작성자

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
