package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 단지관리 운영점검 엔티티
 */
@Entity
@Table(name = "complex_management")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplexManagement {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String complexId; // 단지 ID (FK)

    @Column(nullable = false, length = 20)
    private String checkId; // 점검 ID (예: "CM-01")

    @Column(length = 50)
    private String category; // 분류 (장비 현황, 네트워크, 보안 관리, 운영 관리, 시스템)

    @Column(length = 500)
    private String item; // 점검 항목

    @Column(length = 20)
    private String result; // 양호 / 미흡 / 보완필요

    @Column(length = 500)
    private String note; // 비고
}
