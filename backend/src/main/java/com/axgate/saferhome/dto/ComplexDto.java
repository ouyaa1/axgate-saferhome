package com.axgate.saferhome.dto;

import com.axgate.saferhome.entity.Complex;
import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 단지 정보 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class ComplexDto {

    private String id;
    private String name;
    private String region;
    private String builder;
    private String homenet;
    private String status;
    private String address;
    private String manager;
    private String contact;
    private String report;
    private String regDate;
    private String registrant;
    private String builderManager;
    private String builderContact;
    private String homenetManager;
    private String homenetContact;
    private Integer dongCount;
    private Integer dongStartNum;
    private Integer floorCount;
    private Integer unitsPerFloor;
    private Boolean deviceRegistered;

    /**
     * Entity -> DTO 변환
     */
    public static ComplexDto fromEntity(Complex complex) {
        return ComplexDto.builder()
                .id(complex.getId())
                .name(complex.getName())
                .region(complex.getRegion())
                .builder(complex.getBuilder())
                .homenet(complex.getHomenet())
                .status(complex.getStatus())
                .address(complex.getAddress())
                .manager(complex.getManager())
                .contact(complex.getContact())
                .report(complex.getReport())
                .regDate(complex.getRegDate())
                .registrant(complex.getRegistrant())
                .builderManager(complex.getBuilderManager())
                .builderContact(complex.getBuilderContact())
                .homenetManager(complex.getHomenetManager())
                .homenetContact(complex.getHomenetContact())
                .dongCount(complex.getDongCount())
                .dongStartNum(complex.getDongStartNum())
                .floorCount(complex.getFloorCount())
                .unitsPerFloor(complex.getUnitsPerFloor())
                .deviceRegistered(complex.getDeviceRegistered())
                .build();
    }

    /**
     * DTO -> Entity 변환
     */
    public Complex toEntity() {
        return Complex.builder()
                .id(this.id)
                .name(this.name)
                .region(this.region)
                .builder(this.builder)
                .homenet(this.homenet)
                .status(this.status)
                .address(this.address)
                .manager(this.manager)
                .contact(this.contact)
                .report(this.report)
                .regDate(this.regDate)
                .registrant(this.registrant)
                .builderManager(this.builderManager)
                .builderContact(this.builderContact)
                .homenetManager(this.homenetManager)
                .homenetContact(this.homenetContact)
                .dongCount(this.dongCount)
                .dongStartNum(this.dongStartNum)
                .floorCount(this.floorCount)
                .unitsPerFloor(this.unitsPerFloor)
                .deviceRegistered(this.deviceRegistered)
                .build();
    }
}
