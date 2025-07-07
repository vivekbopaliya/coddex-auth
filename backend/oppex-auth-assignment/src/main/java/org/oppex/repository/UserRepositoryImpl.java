package org.oppex.repository;

import com.speedment.jpastreamer.application.JPAStreamer;
import io.smallrye.mutiny.Uni;
import jakarta.enterprise.context.ApplicationScoped;
import jakarta.inject.Inject;
import jakarta.persistence.EntityManager;
import jakarta.persistence.PersistenceContext;
import org.oppex.model.User;

import java.util.List;
import java.util.Optional;
import java.util.UUID;
import java.util.stream.Collectors;

@ApplicationScoped
public class UserRepositoryImpl implements UserRepository {

    @Inject
    JPAStreamer jpaStreamer;

    @PersistenceContext
    EntityManager em;
    @Override
    public Uni<User> save(User user) {
        return Uni.createFrom().item(() -> {
            em.persist(user);
            return user;
        });
    }

    @Override
    public Uni<User> update(User user) {
        return Uni.createFrom().item(() -> {
            em.merge(user);
            return user;
        });
    }

    @Override
    public Uni<Optional<User>> findByEmail(String email) {
        return Uni.createFrom().item(() ->
                jpaStreamer.stream(User.class)
                        .filter(user -> user.getEmail().equals(email))
                        .findFirst()
        );
    }

    @Override
    public Uni<Optional<User>> findById(UUID id) {
        return Uni.createFrom().item(() ->
            jpaStreamer.stream(User.class)
                    .filter(user -> user.getId().equals(id))
                    .findFirst()
        );
    }

    @Override
    public Uni<Boolean> existsByEmail(String email) {
        return Uni.createFrom().item(() ->
            jpaStreamer.stream(User.class)
                    .anyMatch(user -> user.getEmail().equals(email))
        );
    }

    @Override
    public Uni<Optional<User>> findByVerificationToken(String token) {
        return Uni.createFrom().item(() ->
                jpaStreamer.stream(User.class).filter(f ->
                        f.getVerificationToken().equals(token)
                        ).findFirst()
                );
    }

    @Override
    public Uni<List<User>> findAll() {
        return Uni.createFrom().item(() ->
            jpaStreamer.stream(User.class).collect(Collectors.toList())
        );
    }

    @Override
    public Uni<Void> deleteById(UUID id) {
        return Uni.createFrom().voidItem().invoke(() -> {
            User user = em.find(User.class, id);
            if (user != null) {
                em.remove(user);
            }
        });
    }
}
