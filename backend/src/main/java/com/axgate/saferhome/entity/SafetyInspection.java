package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 안전점검 엔티티
 */
@Entity
@Table(name = "safety_inspection")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class SafetyInspection {

    @Id
    @GeneratedValue(strategy = GenerationType.IDENTITY)
    private Long id;

    @Column(nullable = false, length = 50)
    private String complexId; // 단지 ID (FK)

    @Column(nullable = false, length = 20)
    private String checkId; // 점검 ID (예: "SI-0")

    @Column(length = 50)
    private String category; // 분류 (관리용 PC, 단지 네트워크 장비, 단지서버, 통신 배관실, 집중구내 통신실, 방재실, 기타)

    @Column(length = 500)
    private String item; // 점검 항목

    @Column(length = 50)
    private String cycleRec; // 점검 주기 권장

    @Column(length = 50)
    private String cycleMan; // 점검 주기 관리

    @Column(length = 20)
    private String result; // 양호 / 불량 / 해당없음
}
