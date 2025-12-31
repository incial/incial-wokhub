package com.incial.crm.service;

import com.incial.crm.entity.Otp;
import com.incial.crm.repository.OtpRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.scheduling.annotation.Scheduled;
import org.springframework.stereotype.Service;
import org.springframework.transaction.annotation.Transactional;

import java.security.SecureRandom;
import java.time.LocalDateTime;
import java.util.Optional;

@Service
@RequiredArgsConstructor
public class OtpService {

    private final OtpRepository otpRepository;
    private final EmailService emailService;

    private static final SecureRandom random = new SecureRandom();
    private static final int OTP_EXPIRY_MINUTES = 10;

    /**
     * Generates a new OTP.
     * Deletes old OTPs and inserts new one and the same transaction.
     */
    @Transactional
    public void generateAndSendOtp(String email) {

        // delete must be inside transaction
        otpRepository.deleteByEmail(email);

        String otpCode = String.format("%06d", random.nextInt(1_000_000));

        Otp otp = Otp.builder()
                .email(email)
                .otpCode(otpCode)
                .expiresAt(LocalDateTime.now().plusMinutes(OTP_EXPIRY_MINUTES))
                .verified(false)
                .build();

        otpRepository.save(otp);

        // external IO AFTER DB consistency is guaranteed
        emailService.sendOtpEmail(email, otpCode);

    }

    /**
     * Verifies OTP atomically.
     */
    @Transactional
    public boolean verifyOtp(String email, String otpCode) {

        Optional<Otp> otpOptional =
                otpRepository.findByEmailAndOtpCodeAndVerifiedFalseAndExpiresAtAfter(
                        email, otpCode, LocalDateTime.now()
                );

        if (otpOptional.isEmpty()) {
            return false;
        }

        Otp otp = otpOptional.get();
        otp.setVerified(true);

        return true;
    }

    /**
     * Scheduled / manual cleanup
     */
    @Transactional
    @Scheduled(cron = "0 0 0 * * Sat") // Run every hour
    public void deleteExpiredOtp() {
        otpRepository.deleteByExpiresAtBefore(LocalDateTime.now());
    }
}
