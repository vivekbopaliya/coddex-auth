package org.oppex.services;

import com.sendgrid.*;
import com.sendgrid.helpers.mail.Mail;
import com.sendgrid.helpers.mail.objects.Content;
import com.sendgrid.helpers.mail.objects.Email;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.eclipse.microprofile.config.inject.ConfigProperty;

import java.io.IOException;

@ApplicationScoped
public class EmailService {

    @ConfigProperty(name = "sendgrid.api.key")
    String sendGridApiKey;

    @ConfigProperty(name = "sendgrid.from.email")
    String fromEmail;

    @ConfigProperty(name = "sendgrid.from.name", defaultValue = "Oppex")
    String fromName;

    @ConfigProperty(name = "app.email.verification.base-url", defaultValue = "http://localhost:5173/verify")
    String verificationBaseUrl;

    public boolean sendVerificationEmail(String email, String verificationToken) {
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

        return sendEmail(email, subject, body);
    }

    public boolean sendWelcomeEmail(String email) {
        String subject = "Welcome to Oppex - Email Verified!";
        String body = """
            <html>
            <body>
                <h2>Welcome to Oppex!</h2>
                <p>Your email address has been successfully verified.</p>
                <p>You can now access all features of the portal.</p>
                <p>Best regards,<br>The Oppex Team</p>
            </body>
            </html>
            """;

        return sendEmail(email, subject, body);
    }

    public boolean sendEmail(String to, String subject, String htmlBody) {
        Email from = new Email(fromEmail, fromName);
        Email toEmail = new Email(to);
        Content content = new Content("text/html", htmlBody);
        Mail mail = new Mail(from, subject, toEmail, content);

        SendGrid sg = new SendGrid(sendGridApiKey);
        Request request = new Request();

        try {
            request.setMethod(Method.POST);
            request.setEndpoint("mail/send");
            request.setBody(mail.build());
            Response response = sg.api(request);

            System.out.printf("📤 Sent to %s | Status: %d | Body: %s%n", to, response.getStatusCode(), response.getBody());
            return response.getStatusCode() >= 200 && response.getStatusCode() < 300;

        } catch (IOException e) {
            System.err.println("❌ Failed to send email to " + to);
            e.printStackTrace();
            return false;
        }
    }
}
