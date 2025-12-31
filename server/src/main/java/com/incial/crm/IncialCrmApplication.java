package com.incial.crm;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;
import org.springframework.scheduling.annotation.EnableScheduling;

@SpringBootApplication
@EnableScheduling
public class IncialCrmApplication {
    public static void main(String[] args) {
        SpringApplication.run(IncialCrmApplication.class, args);
    }
}
