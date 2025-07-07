package org.oppex.services;

import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import org.oppex.DTOs.CommonResponse;
import org.oppex.DTOs.LoginRequest;
import org.oppex.DTOs.SignupRequest;
import org.oppex.model.User;
import org.oppex.repository.UserRepository;

import java.time.LocalDateTime;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserService {

    @Inject
    PasswordService passwordService;
    @Inject
    UserRepository userRepository;
    @Inject
    EmailService emailService;

    @WithSession
    @WithTransaction
    public Uni<CommonResponse> signup(SignupRequest request){
        return userRepository.existsByEmail(request.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        return Uni.createFrom().failure(new Exception("Email already exists!"));
                    }

                    String salt = passwordService.generateSalt();
                    String hashedPassword = passwordService.hashPassword(request.getPassword(), salt);

                    String verificationToken = UUID.randomUUID().toString();
                    User user = new User(request.getEmail(), hashedPassword, salt, verificationToken, LocalDateTime.now().plusHours(1));

                    return userRepository.save(user)
                            .flatMap(savedUser -> {
                                // ✅ Blocking email send (non-reactive now)
                                boolean emailSent = emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);

                                if (emailSent) {
                                    System.out.println("✅ Verification email sent");
                                } else {
                                    System.err.println("❌ Failed to send verification email");
                                }

                                return Uni.createFrom().item(
                                        new CommonResponse("Verification token has been sent to your email.", savedUser, true)
                                );
                            });
                });
    }


    public Uni<CommonResponse> login(LoginRequest request){
        return userRepository.findByEmail(request.getEmail()).flatMap(user -> {
            if (user.isEmpty()){
                return Uni.createFrom().failure(new Exception("No user found!"));
            }

            Boolean isCorrect = passwordService.verifyPassword(request.getPassword(), user.get().getPassword(), user.get().getSalt());
            if (!isCorrect){
                return Uni.createFrom().failure(new Exception("Password is incorrect!"));
            }

            // Return user data instead of JWT - Node.js will handle JWT generation
            return Uni.createFrom().item(new CommonResponse("Login successful", user.get(), true));
        });
    }

    @WithSession
    @WithTransaction
    public Uni<CommonResponse> verifyEmail(String token) {
        return userRepository.findByVerificationToken(token)
                .flatMap(userOpt -> {
                    if (userOpt.isEmpty()) {
                        return Uni.createFrom().item(new CommonResponse("Invalid verification token", null, false));
                    }

                    System.out.println(userOpt.get());
                    User user = userOpt.get();

                    // Check if token is expired
                    if (user.getExpiryDateOfToken().isBefore(LocalDateTime.now())) {
                        return Uni.createFrom().item(new CommonResponse("Verification token has expired", null, false));
                    }

                    user.setEmailVerified(true);
                    user.setVerificationToken(null);

                    System.out.println("HELLO");
                    return userRepository.update(user)
                            .flatMap(updatedUser -> {
                                emailService.sendWelcomeEmail(updatedUser.getEmail());
                                return Uni.createFrom().item(new CommonResponse("Email verified successfully", null, true));
                            });
                });
    }

    public Uni<Optional<User>> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    public Uni<Optional<User>> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }

    public Uni<CommonResponse> resendVerificationEmail(String email) {
        return userRepository.findByEmail(email)
                .flatMap(userOpt -> {
                    if (userOpt.isEmpty()) {
                        return Uni.createFrom().failure(new RuntimeException("User not found"));
                    }

                    User user = userOpt.get();

                    if (user.isEmailVerified()) {
                        return Uni.createFrom().failure(new RuntimeException("Email is already verified"));
                    }

                    String verificationToken = UUID.randomUUID().toString();
                    user.setVerificationToken(verificationToken);

                    return userRepository.update(user)
                            .flatMap(updatedUser -> {
                                emailService.sendVerificationEmail(updatedUser.getEmail(), verificationToken);
                                return Uni.createFrom().item(new CommonResponse("Verification email sent", email, true));
                            });
                });
    }
}