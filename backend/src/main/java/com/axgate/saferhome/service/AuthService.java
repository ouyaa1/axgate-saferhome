package com.axgate.saferhome.service;

import com.axgate.saferhome.config.JwtTokenProvider;
import com.axgate.saferhome.dto.LoginRequest;
import com.axgate.saferhome.dto.LoginResponse;
import com.axgate.saferhome.entity.Account;
import com.axgate.saferhome.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.boot.CommandLineRunner;
import org.springframework.context.annotation.Bean;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.time.LocalDateTime;

/**
 * 인증 서비스 - 로그인/로그아웃 처리
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AuthService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;
    private final JwtTokenProvider jwtTokenProvider;

    /**
     * 로그인 처리
     */
    @Transactional
    public LoginResponse login(LoginRequest request) {
        // 사용자 조회
        Account account = accountRepository.findByUsername(request.getUsername())
                .orElseThrow(() -> new RuntimeException("사용자를 찾을 수 없습니다: " + request.getUsername()));

        // 비밀번호 검증
        if (!passwordEncoder.matches(request.getPassword(), account.getPassword())) {
            throw new RuntimeException("비밀번호가 일치하지 않습니다");
        }

        // 계정 상태 확인
        if ("비활성".equals(account.getStatus())) {
            throw new RuntimeException("비활성화된 계정입니다");
        }

        // 마지막 로그인 시간 업데이트
        account.setLastLogin(LocalDateTime.now());
        accountRepository.save(account);

        // JWT 토큰 생성
        String token = jwtTokenProvider.generateToken(account.getUsername(), account.getRole());

        return LoginResponse.builder()
                .token(token)
                .username(account.getUsername())
                .name(account.getName())
                .role(account.getRole())
                .complex(account.getComplex())
                .build();
    }

    /**
     * 초기 관리자 계정 생성 (애플리케이션 시작 시)
     */
    @Bean
    public CommandLineRunner initDefaultAdmin() {
        return args -> {
            if (!accountRepository.existsByUsername("admin")) {
                Account admin = Account.builder()
                        .username("admin")
                        .password(passwordEncoder.encode("admin123"))
                        .name("시스템 관리자")
                        .role("최고관리자")
                        .complex("전체")
                        .status("활성")
                        .email("admin@axgate.com")
                        .build();
                accountRepository.save(admin);
                log.info("기본 관리자 계정이 생성되었습니다 (admin / admin123)");
            }
        };
    }
}
