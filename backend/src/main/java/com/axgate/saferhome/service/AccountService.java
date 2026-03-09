package com.axgate.saferhome.service;

import com.axgate.saferhome.entity.Account;
import com.axgate.saferhome.repository.AccountRepository;
import lombok.RequiredArgsConstructor;
import lombok.extern.slf4j.Slf4j;
import org.springframework.security.crypto.password.PasswordEncoder;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.util.List;

/**
 * 계정 관리 서비스
 */
@Slf4j
@Service
@RequiredArgsConstructor
public class AccountService {

    private final AccountRepository accountRepository;
    private final PasswordEncoder passwordEncoder;

    /**
     * 전체 계정 목록 조회
     */
    @Transactional(readOnly = true)
    public List<Account> getAllAccounts() {
        return accountRepository.findAll();
    }

    /**
     * 계정 상세 조회
     */
    @Transactional(readOnly = true)
    public Account getAccount(Long id) {
        return accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("계정을 찾을 수 없습니다: " + id));
    }

    /**
     * 계정 생성
     */
    @Transactional
    public Account createAccount(Account account) {
        if (accountRepository.existsByUsername(account.getUsername())) {
            throw new RuntimeException("이미 사용 중인 사용자명입니다: " + account.getUsername());
        }

        // 비밀번호 암호화
        account.setPassword(passwordEncoder.encode(account.getPassword()));

        // 기본 상태 설정
        if (account.getStatus() == null) {
            account.setStatus("활성");
        }

        Account saved = accountRepository.save(account);
        log.info("계정 생성 완료: {}", saved.getUsername());
        return saved;
    }

    /**
     * 계정 정보 수정
     */
    @Transactional
    public Account updateAccount(Long id, Account accountData) {
        Account existing = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("계정을 찾을 수 없습니다: " + id));

        existing.setName(accountData.getName());
        existing.setRole(accountData.getRole());
        existing.setComplex(accountData.getComplex());
        existing.setStatus(accountData.getStatus());
        existing.setEmail(accountData.getEmail());

        // 비밀번호가 제공된 경우에만 업데이트
        if (accountData.getPassword() != null && !accountData.getPassword().isEmpty()) {
            existing.setPassword(passwordEncoder.encode(accountData.getPassword()));
        }

        Account saved = accountRepository.save(existing);
        log.info("계정 수정 완료: {}", saved.getUsername());
        return saved;
    }

    /**
     * 계정 삭제
     */
    @Transactional
    public void deleteAccount(Long id) {
        Account account = accountRepository.findById(id)
                .orElseThrow(() -> new RuntimeException("계정을 찾을 수 없습니다: " + id));

        if ("admin".equals(account.getUsername())) {
            throw new RuntimeException("기본 관리자 계정은 삭제할 수 없습니다");
        }

        accountRepository.deleteById(id);
        log.info("계정 삭제 완료: {}", account.getUsername());
    }
}
