package com.example.demo.repository;

import com.example.demo.entity.UserVoucher;
import org.springframework.data.jpa.repository.JpaRepository;

import java.util.List;
import java.util.Optional;

public interface UserVoucherRepository extends JpaRepository<UserVoucher, Long> {

    Optional<UserVoucher> findByUserIdAndVoucherId(Long userId, Long voucherId);

    List<UserVoucher> findByUserIdAndIsUsedFalse(Long userId);
}
