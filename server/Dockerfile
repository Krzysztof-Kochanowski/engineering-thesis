FROM maven:3.8.6-eclipse-temurin-17 AS build  
COPY src /usr/src/app/src  
COPY pom.xml /usr/src/app  
RUN mvn -f /usr/src/app/pom.xml clean package -Pdev -DskipTests

FROM openjdk:17-oracle

WORKDIR /usr/app

ARG JAR_FILE=app-server.jar

COPY --from=build /usr/src/app/target/${JAR_FILE} /usr/app/${JAR_FILE}
EXPOSE 8080  
ENTRYPOINT ["java","-jar","/usr/app/app-server.jar"] 