package org.oppex.repository;

import io.smallrye.mutiny.Uni;
import org.oppex.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;

public interface UserRepository {

    Uni<User> save(User user);

    Uni<User> update(User user);

    Uni<Optional<User>> findByEmail(String email);

    Uni<Optional<User>> findById(UUID id);

    Uni<Boolean> existsByEmail(String email);

    Uni<Optional<User>> findByVerificationToken(String token);

    Uni<List<User>> findAll();

    Uni<Void> deleteById(UUID id);
}