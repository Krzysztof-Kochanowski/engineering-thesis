package com.app.server.config;

import lombok.RequiredArgsConstructor;
import org.apache.commons.dbcp2.BasicDataSource;
import org.springframework.context.annotation.Bean;
import org.springframework.context.annotation.Configuration;
import org.springframework.context.annotation.Profile;
import org.springframework.core.env.Environment;

@Configuration
@Profile("prod")
@RequiredArgsConstructor
public class ProdDatasourceConfig {
    private final Environment env;

    @Bean
    public BasicDataSource dataSource() {
        String dbUrl = System.getenv("JDBC_DATABASE_URL");
        String username = System.getenv("JDBC_DATABASE_USERNAME");
        String password = System.getenv("JDBC_DATABASE_PASSWORD");

        if (dbUrl == null) {
            env.getProperty("spring.datasource.url");
        }

        if (username == null) {
            env.getProperty("spring.datasource.username");
        }

        if (password == null) {
            env.getProperty("spring.datasource.password");
        }

        BasicDataSource basicDataSource = new BasicDataSource();
        basicDataSource.setUrl(dbUrl);
        basicDataSource.setUsername(username);
        basicDataSource.setPassword(password);

        return basicDataSource;
    }
}