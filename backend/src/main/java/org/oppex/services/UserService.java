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
                        return Uni.createFrom().failure(new Exception("Email already exists, Simply login!"));
                    }

                    String salt = passwordService.generateSalt();
                    String hashedPassword = passwordService.hashPassword(request.getPassword(), salt);

                    String verificationToken = UUID.randomUUID().toString();
                    User user = new User(request.getEmail(), hashedPassword, salt, verificationToken);

                    return userRepository.save(user)
                            .flatMap(savedUser -> {
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
                return Uni.createFrom().failure(new Exception("There is no user with that email exists."));
            }

            Boolean isCorrect = passwordService.verifyPassword(request.getPassword(), user.get().getPassword(), user.get().getSalt());
            if (!isCorrect){
                return Uni.createFrom().failure(new Exception("Password is incorrect."));
            }
            return Uni.createFrom().item(new CommonResponse("Login successful", user.get(), true));
        });
    }

    @WithSession
    @WithTransaction
    public Uni<CommonResponse> verifyEmail(String token) {
        return userRepository.findByVerificationToken(token)
                .flatMap(userOpt -> {
                    if (userOpt.isEmpty()) {
                        return Uni.createFrom().failure(new Exception("Invalid verification token."));
                    }

                    if(userOpt.get().isEmailVerified()){
                        return Uni.createFrom().item(new CommonResponse("User is already verified, You can go ahead and login.", null, true));
                    }

                    User user = userOpt.get();

                    user.setEmailVerified(true);
                    return userRepository.update(user)
                            .flatMap(updatedUser -> {
                                emailService.sendWelcomeEmail(updatedUser.getEmail());
                                return Uni.createFrom().item(new CommonResponse("Your email has been successfully verified. You can now access your account.\n" +
                                        "\n", null, true));
                            });
                });
    }

    @WithSession
    public Uni<CommonResponse> getAuthStatus(UUID userId) {
        return userRepository.findById(userId)
                .flatMap(userOpt -> {
                    if (userOpt.isEmpty()) {
                        return Uni.createFrom().failure(new Exception("User not found or session expired."));
                    }

                    User user = userOpt.get();

                    return Uni.createFrom().item(
                            new CommonResponse("Authentication status retrieved successfully.", user.isEmailVerified(), true)
                    );
                });
    }

    public Uni<Optional<User>> getUserById(UUID userId) {
        return userRepository.findById(userId);
    }

    public Uni<Optional<User>> getUserByEmail(String email) {
        return userRepository.findByEmail(email);
    }
}