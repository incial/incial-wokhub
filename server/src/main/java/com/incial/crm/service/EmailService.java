package com.incial.crm.service;

import jakarta.mail.internet.MimeMessage;
import lombok.RequiredArgsConstructor;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.mail.javamail.JavaMailSender;
import org.springframework.mail.javamail.MimeMessageHelper;
import org.springframework.stereotype.Service;

@Service
@RequiredArgsConstructor
public class EmailService {

    private final JavaMailSender mailSender;

    @Value("${spring.mail.username}")
    private String fromEmail;

    public void sendOtpEmail(String toEmail, String otp) {
        try {
            MimeMessage message = mailSender.createMimeMessage();
            MimeMessageHelper helper = new MimeMessageHelper(message, true, "UTF-8");

            helper.setFrom(fromEmail, "Incial Security");
            helper.setTo(toEmail);
            helper.setSubject("Password Reset OTP");

            helper.setText(buildHtmlOtpTemplate(otp), true);

            mailSender.send(message);

        } catch (Exception e) {
            throw new RuntimeException("Failed to send premium email", e);
        }
    }

    private String buildHtmlOtpTemplate(String otp) {
        return """
        <!DOCTYPE html>
        <html>
        <head>
            <meta charset="UTF-8">
            <title>Password Reset OTP</title>
        </head>
        <body style="margin:0;padding:0;background-color:#f4f6f8;font-family:Arial,Helvetica,sans-serif;">
            <table width="100%%" cellpadding="0" cellspacing="0">
                <tr>
                    <td align="center" style="padding:40px 0;">
                        <table width="480" cellpadding="0" cellspacing="0"
                               style="background:#ffffff;border-radius:12px;padding:32px;
                                      box-shadow:0 8px 24px rgba(0,0,0,0.08);">
                            
                            <tr>
                                <td style="font-size:20px;font-weight:600;color:#111827;">
                                    Password Reset Request
                                </td>
                            </tr>

                            <tr>
                                <td style="padding-top:12px;font-size:14px;color:#374151;line-height:1.6;">
                                    Use the OTP below to reset your password. This code is valid for 10 minutes.
                                </td>
                            </tr>

                            <tr>
                                <td align="center" style="padding:28px 0;">
                                    <div style="
                                        display:inline-block;
                                        padding:14px 26px;
                                        font-size:28px;
                                        font-weight:700;
                                        letter-spacing:6px;
                                        color:#111827;
                                        background:#f3f4f6;
                                        border-radius:8px;">
                                        %s
                                    </div>
                                </td>
                            </tr>

                            <tr>
                                <td style="font-size:13px;color:#6b7280;line-height:1.6;">
                                    If you did not request a password reset, you can safely ignore this email.
                                </td>
                            </tr>

                            <tr>
                                <td style="padding-top:28px;font-size:12px;color:#9ca3af;
                                           border-top:1px solid #e5e7eb;">
                                    © 2025 Incial · Security Notification<br>
                                    Please do not reply to this email.
                                </td>
                            </tr>

                        </table>
                    </td>
                </tr>
            </table>
        </body>
        </html>
        """.formatted(otp);
    }
}
