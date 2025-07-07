package org.oppex.controllers;

import io.smallrye.mutiny.Uni;
import jakarta.inject.Inject;
import jakarta.validation.Valid;
import jakarta.ws.rs.*;
import jakarta.ws.rs.core.MediaType;
import jakarta.ws.rs.core.Response;
import org.oppex.DTOs.CommonResponse;
import org.oppex.DTOs.LoginRequest;
import org.oppex.DTOs.SignupRequest;
import org.oppex.services.UserService;

@Path("/")
@Produces(MediaType.APPLICATION_JSON)
@Consumes(MediaType.APPLICATION_JSON)
public class UserController {

    @Inject
    UserService userService;

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

    @POST
    @Path("/resend-verification")
    public Uni<Response> resendVerificationEmail(@QueryParam("email") String email) {
        if (email == null || email.trim().isEmpty()) {
            return Uni.createFrom().item(Response.status(Response.Status.BAD_REQUEST)
                    .entity(new CommonResponse<>("You need to sign up first", null, false))
                    .build());
        }

        return userService.resendVerificationEmail(email)
                .map(response -> Response.ok(response).build())
                .onFailure().recoverWithItem(throwable -> {
                    String message = throwable.getMessage();
                    return Response.status(Response.Status.BAD_REQUEST)
                            .entity(new CommonResponse<>(message, null,false))
                            .build();
                });
    }

    @GET
    @Path("/health")
    public Response health() {
        return Response.ok("Auth service is running").build();
    }
}
