package org.oppex.services;

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

    @Inject
    JwtService jwtService;
    public Uni<CommonResponse> signup(SignupRequest request){
        return userRepository.existsByEmail(request.getEmail())
                .flatMap(exists -> {
                    if (exists) {
                        return Uni.createFrom().failure(new Exception("Email already exists!"));
                    }

                    String salt = passwordService.generateSalt();
                    String hashedPassword = passwordService.hashPassword(request.getPassword(),  salt);

                    String verificationToken = jwtService.generateEmailVerificationToken(request.getEmail());
                    User user = new User(request.getEmail(), hashedPassword, salt, verificationToken, LocalDateTime.now().plusHours(1));

                    return  userRepository.save(user).flatMap(savedUser -> {
                            emailService.sendVerificationEmail(savedUser.getEmail(), verificationToken);
                                return Uni.createFrom().item(new CommonResponse("Verification token has been sent to your email.", savedUser, true));
                            }
                    );
                });
    }

    public Uni<CommonResponse> login(LoginRequest request){
        return userRepository.findByEmail(request.getEmail()).flatMap(user -> {
            if (user.isEmpty()){
                return Uni.createFrom().failure(new Exception("No user found!"));
            }

            Boolean isCorrect = passwordService.verifyPassword(request.getPassword(), user.get().getPasswordHash(), user.get().getSalt());
            if (!isCorrect){
                return Uni.createFrom().failure(new Exception("Password is incorrect!"));
            }

            String jwtToken = jwtService.generateToken(user.get());
            String message = user.get().isEmailVerified() ? "Your email is validated. You can access the portal" : "You need to validate your email to access the portal";

            return Uni.createFrom().item(new CommonResponse(message, jwtToken, true));

        });
    }

    public Uni<CommonResponse> verifyEmail(String token) {
        return userRepository.findByVerificationToken(token)
                .flatMap(userOpt -> {
                    if (userOpt.isEmpty()) {
                        return Uni.createFrom().item(new CommonResponse("Invalid verification token",null, false));
                    }

                    User user = userOpt.get();

//                    // Check if token is expired
//                    if (user.getExpiryDateOfToken().isBefore(LocalDateTime.now())) {
//                        return Uni.createFrom().item(new CommonResponse("Verification token has expired", null, false));
//                    }

                    user.setEmailVerified(true);
                    user.setVerificationToken(null);
                    user.setExpiryDateOfToken(null);

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

                    String verificationToken = jwtService.generateEmailVerificationToken(email);

                    return userRepository.update(user)
                            .flatMap(updatedUser -> {
                                emailService.sendVerificationEmail(updatedUser.getEmail(), verificationToken);
                                return Uni.createFrom().item(new CommonResponse("Verification email sent" , email, true));
                            });
                });
    }
}
