# ---- Build Stage ----
    FROM --platform=linux/amd64 maven:3.9.6-eclipse-temurin-17 AS build

    WORKDIR /build
    COPY . .
    RUN mvn package -DskipTests
    
    # ---- Final Stage ----
    FROM  --platform=linux/amd64  registry.access.redhat.com/ubi8/openjdk-17-runtime
    
    WORKDIR /app
    
    # Copy the built JAR
    COPY --from=build /build/target/quarkus-app/ /app/
    EXPOSE 8080
    
    CMD ["java", "-jar", "/app/quarkus-run.jar"]