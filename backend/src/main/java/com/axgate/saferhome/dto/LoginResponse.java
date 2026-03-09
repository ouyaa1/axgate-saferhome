package com.axgate.saferhome.dto;

import lombok.AllArgsConstructor;
import lombok.Builder;
import lombok.Data;
import lombok.NoArgsConstructor;

/**
 * 로그인 응답 DTO
 */
@Data
@NoArgsConstructor
@AllArgsConstructor
@Builder
public class LoginResponse {

    private String token;       // JWT 토큰
    private String username;    // 사용자명
    private String name;        // 이름
    private String role;        // 역할
    private String complex;     // 소속 단지
}
