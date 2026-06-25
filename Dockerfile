# Fase 1: compilar con Java 21
FROM maven:3.9.9-eclipse-temurin-21 AS build
WORKDIR /app
COPY . .
RUN mvn -f Proyecto1/pom.xml clean package -DskipTests

# Fase 2: ejecutar
FROM eclipse-temurin:21-jre
WORKDIR /app
COPY --from=build /app/Proyecto1/target/*.jar app.jar
EXPOSE 8080
ENTRYPOINT ["java", "-jar", "app.jar"]