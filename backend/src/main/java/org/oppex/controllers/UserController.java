package org.oppex.controllers;

import io.quarkus.mailer.Mail;
import io.quarkus.mailer.Mailer;
import io.quarkus.mailer.reactive.ReactiveMailer;
import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.oppex.DTOs.CommonResponse;
import org.oppex.DTOs.LoginRequest;
import org.oppex.DTOs.SignupRequest;
import org.oppex.services.EmailService;
import org.oppex.services.UserService;

import java.util.UUID;

@Path("/api")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    @Inject
    UserService userService;
    @Inject
    Mailer mailer;
    @Inject
    EmailService emailService;
    @POST
    @Path("/signup")
    public Uni<Response> signup(@Valid SignupRequest request) {
        return userService.signup(request)
                .map(response -> Response.ok(response).build())
                .onFailure().recoverWithItem(throwable -> {
                    String message = throwable.getMessage();
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new CommonResponse<>(message , null, false))
                            .build();
                });
    }


    @GET
    @Path("/test-mail")
    @Produces(MediaType.TEXT_PLAIN)
    public String send() {
        boolean result = emailService.sendEmail(
                "vivekpatel1nov@gmail.com",
                "🎉 Web API Email via Quarkus",
                "<h1>This was sent using SendGrid Web API</h1>"
        );

        return result ? "✅ Email sent via Web API!" : "❌ Failed to send via Web API";
    }
    @POST
    @Path("/login")
    public Uni<Response> login(@Valid LoginRequest request) {
        return userService.login(request)
                .map(response -> Response.ok(response).build())
                .onFailure().recoverWithItem(throwable -> {
                    String message = throwable.getMessage();
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new CommonResponse<>(message , null, false))
                            .build();
                });
    }
    @GET
    @Path("/verify")
    public Uni<Response> verifyEmail(@QueryParam("token") String token) {

        System.out.println("token: " + token);
        if (token == null || token.trim().isEmpty()) {
            return Uni.createFrom().item(Response.status(Response.Status.BAD_REQUEST)
                    .entity(new CommonResponse<>( "Verification token is required", null, false))
                    .build());
        }

        return userService.verifyEmail(token)
                .map(response -> Response.ok(response).build())
                .onFailure().recoverWithItem(throwable -> {
                    String message = throwable.getMessage();
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new CommonResponse<>( message, null, false))
                            .build();
                });
    }

    @GET
    @Path("/check-status/{userId}")
    public Uni<Response> checkVerifyStatus(@PathParam("userId") UUID userId) {
        return userService.getAuthStatus(userId)
                .map(authStatus -> {
                    return Response.ok(authStatus).build();
                })
                .onFailure().recoverWithItem(throwable -> {
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new CommonResponse<>(throwable.getMessage(), null, false))
                            .build();
                });
    }

    @GET
    @Path("/health")
    public Response health() {
        return Response.ok("Auth service is running").build();
    }
}
