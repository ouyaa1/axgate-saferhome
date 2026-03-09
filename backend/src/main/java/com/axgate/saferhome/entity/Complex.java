package com.axgate.saferhome.entity;

import jakarta.persistence.*;
import lombok.*;

/**
 * 단지 엔티티 - 아파트 단지 정보
 */
@Entity
@Table(name = "complex")
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class Complex {

    @Id
    @Column(length = 50)
    private String id; // 단지 ID (예: "AX-PRM-01")

    @Column(nullable = false, length = 100)
    private String name; // 단지명

    @Column(length = 50)
    private String region; // 지역

    @Column(length = 100)
    private String builder; // 건설사

    @Column(length = 100)
    private String homenet; // 홈넷사

    @Column(length = 20)
    private String status; // 정상 / 오프라인 / 점검중

    @Column(length = 255)
    private String address; // 상세주소

    @Column(length = 50)
    private String manager; // 관리사무소 담당자

    @Column(length = 50)
    private String contact; // 연락처

    @Column(length = 20)
    private String report; // 발급 / 미발급

    @Column(length = 20)
    private String regDate; // 등록일

    @Column(length = 50)
    private String registrant; // 등록자

    @Column(length = 50)
    private String builderManager; // 건설사 담당자

    @Column(length = 50)
    private String builderContact; // 건설사 연락처

    @Column(length = 50)
    private String homenetManager; // 홈넷사 담당자

    @Column(length = 50)
    private String homenetContact; // 홈넷사 연락처

    @Column
    private Integer dongCount; // 동 수

    @Column
    private Integer dongStartNum; // 동 시작번호

    @Column
    private Integer floorCount; // 층 수

    @Column
    private Integer unitsPerFloor; // 층당 세대 수

    @Column
    private Boolean deviceRegistered; // 장비 등록 여부
}
