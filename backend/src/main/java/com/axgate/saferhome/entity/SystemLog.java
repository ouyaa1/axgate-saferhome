package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 시스템 로그 엔티티
 */
@Entity
@Table(name = "system_log")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SystemLog {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(length = 50)
    private String time; // 시간 문자열

    @Column(length = 20)
    private String level; // 레벨 (CRITICAL / WARN / INFO)

    @Column(length = 100)
    private String source; // 출처

    @Column(length = 500)
    private String message; // 메시지

    @Column
    private LocalDateTime createdAt; // 생성일시

    @PrePersist
    protected void onCreate() {
        this.createdAt = LocalDateTime.now();
    }
}
