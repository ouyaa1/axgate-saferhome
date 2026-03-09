package com.axgate.saferhome.controller;

import com.axgate.saferhome.entity.Account;
import com.axgate.saferhome.service.AccountService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.*;

import java.util.List;

/**
 * 계정 관리 컨트롤러
 */
@RestController
@RequestMapping("/api/accounts")
@RequiredArgsConstructor
public class AccountController {

    private final AccountService accountService;

    /**
     * GET /api/accounts - 전체 계정 목록 조회
     */
    @GetMapping
    public ResponseEntity<List<Account>> getAllAccounts() {
        List<Account> accounts = accountService.getAllAccounts();
        // 비밀번호 필드 마스킹 처리
        accounts.forEach(account -> account.setPassword(null));
        return ResponseEntity.ok(accounts);
    }

    /**
     * GET /api/accounts/{id} - 계정 상세 조회
     */
    @GetMapping("/{id}")
    public ResponseEntity<Account> getAccount(@PathVariable Long id) {
        Account account = accountService.getAccount(id);
        account.setPassword(null); // 비밀번호 숨기기
        return ResponseEntity.ok(account);
    }

    /**
     * POST /api/accounts - 계정 생성
     */
    @PostMapping
    public ResponseEntity<Account> createAccount(@RequestBody Account account) {
        Account created = accountService.createAccount(account);
        created.setPassword(null);
        return ResponseEntity.status(HttpStatus.CREATED).body(created);
    }

    /**
     * PUT /api/accounts/{id} - 계정 정보 수정
     */
    @PutMapping("/{id}")
    public ResponseEntity<Account> updateAccount(@PathVariable Long id, @RequestBody Account account) {
        Account updated = accountService.updateAccount(id, account);
        updated.setPassword(null);
        return ResponseEntity.ok(updated);
    }

    /**
     * DELETE /api/accounts/{id} - 계정 삭제
     */
    @DeleteMapping("/{id}")
    public ResponseEntity<Void> deleteAccount(@PathVariable Long id) {
        accountService.deleteAccount(id);
        return ResponseEntity.noContent().build();
    }
}
