package org.oppex.services;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

@ApplicationScoped
public class EmailService {

    @Inject
    Mailer mailer;

    @ConfigProperty(name = "app.email.verification.base-url", defaultValue = "http://localhost:3000/verify")
    String verificationBaseUrl;

    /**
     * Sends an email verification link to the user
     */
    public void sendVerificationEmail(String email, String verificationToken) {
        String verificationUrl = verificationBaseUrl + "?token=" + verificationToken;

        String subject = "Verify your email address";
        String body = String.format("""
            <html>
            <body>
                <h2>Welcome to Oppex!</h2>
                <p>Please click the link below to verify your email address:</p>
                <p><a href="%s">Verify Email</a></p>
                <p>If the link doesn't work, copy and paste this URL into your browser:</p>
                <p>%s</p>
                <p>This link will expire in 1 hour.</p>
                <p>Best regards,<br>The Oppex Team</p>
            </body>
            </html>
            """, verificationUrl, verificationUrl);

        Mail mail = Mail.withHtml(email, subject, body);
        mailer.send(mail);
    }

    /**
     * Sends a welcome email after successful verification
     */
    public void sendWelcomeEmail(String email) {
        String subject = "Welcome to Oppex - Email Verified!";
        String body = String.format("""
            <html>
            <body>
                <h2>Welcome to Oppex!</h2>
                <p>Your email address has been successfully verified.</p>
                <p>You can now access all features of the portal.</p>
                <p>Best regards,<br>The Oppex Team</p>
            </body>
            </html>
            """);

        Mail mail = Mail.withHtml(email, subject, body);
        mailer.send(mail);
    }
}