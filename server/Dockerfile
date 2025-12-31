# =========================
# Stage 1: Build
# =========================
FROM maven:3.9.6-amazoncorretto-17 AS build

WORKDIR /app

COPY pom.xml .
RUN mvn dependency:go-offline -B

COPY src ./src
RUN mvn clean package -DskipTests

# =========================
# Stage 2: Runtime (SMALL + STABLE)
# =========================
FROM eclipse-temurin:17-jre-jammy

WORKDIR /app

COPY --from=build /app/target/*.jar app.jar

# Run as non-root
RUN useradd -r -u 1001 incial && \
    chown -R incial:incial /app

USER incial

ENV JAVA_OPTS="-XX:MaxRAMPercentage=75 \
               -XX:+UseContainerSupport \
               -XX:+UseG1GC"

EXPOSE 8080

ENTRYPOINT ["sh", "-c", "java $JAVA_OPTS -jar app.jar"]
