package org.oppex.repository;

import io.quarkus.hibernate.reactive.panache.common.WithSession;
import io.quarkus.hibernate.reactive.panache.common.WithTransaction;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import org.oppex.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

@ApplicationScoped
public class UserRepositoryImpl implements UserRepository {

    @Override
    public Uni<User> save(User user) {
        return user.persist().replaceWith(user);
    }

    @Override
  // Add transaction annotation
    public Uni<User> update(User user) {
        return user.flush().replaceWith(user);
    }
    @WithSession
    @Override
    public Uni<Optional<User>> findByEmail(String email) {
        return User.find("email", email).firstResult()
                .map(u -> Optional.ofNullable((User) u));
    }

    @WithSession
    @Override
    public Uni<Optional<User>> findById(UUID id) {
        return User.findById(id)
                .map(u -> Optional.ofNullable((User) u));
    }

    @Override
    public Uni<Boolean> existsByEmail(String email) {
        return User.count("email", email).map(c -> c > 0);
    }

    @Override
    public Uni<Optional<User>> findByVerificationToken(String token) {
        return User.find("verificationToken", token).firstResult()
                .map(u -> Optional.ofNullable((User) u));
    }

    @WithSession
    @Override
    public Uni<List<User>> findAll() {
        return User.findAll().list();
    }

    @Override
    @WithTransaction  // Add transaction annotation
    public Uni<Void> deleteById(UUID id) {
        return User.deleteById(id).replaceWithVoid();
    }
}