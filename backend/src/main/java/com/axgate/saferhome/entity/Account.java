package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

import java.time.LocalDateTime;

/**
 * 계정 엔티티 - 사용자 계정 정보
 */
@Entity
@Table(name = "account")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Account {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, unique = true, length = 50)
    private String username; // 로그인 ID

    @Column(nullable = false, length = 255)
    private String password; // BCrypt 인코딩된 비밀번호

    @Column(nullable = false, length = 50)
    private String name; // 이름

    @Column(nullable = false, length = 20)
    private String role; // 역할 (최고관리자 / 관리자 / 운영자 / 모니터링)

    @Column(length = 100)
    private String complex; // 소속 단지

    @Column(length = 20)
    private String status; // 상태 (활성 / 비활성)

    @Column(length = 100)
    private String email; // 이메일

    @Column
    private LocalDateTime lastLogin; // 마지막 로그인 시간
}
