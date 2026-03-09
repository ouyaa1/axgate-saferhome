package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 보고서 엔티티
 */
@Entity
@Table(name = "report")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Report {

    @Id
    @Column(length = 100)
    private String id; // 보고서 ID (예: "REP-AX-PRM-01-01")

    @Column(nullable = false, length = 50)
    private String complexId; // 단지 ID (FK)

    @Column(length = 20)
    private String date; // 작성일

    @Column(length = 200)
    private String title; // 제목

    @Column(length = 50)
    private String type; // 유형 (취약점 점검 / 안전 점검 / 단지 보고서 / 종합 보고서)

    @Column(length = 50)
    private String author; // 작성자

    @Column(length = 50)
    private String size; // 파일 크기

    @Column(length = 20)
    private String status; // 상태 (완료 / 점검중 / 대기)
}
