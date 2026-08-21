package com.canteen;

import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class CanteenApplication {

    public static void main(String[] args) {
        SpringApplication.run(CanteenApplication.class, args);
        System.out.println("==================================================");
        System.out.println(" College Canteen Management Backend Started! ");
        System.out.println(" Server running at: http://localhost:8080");
        System.out.println("==================================================");
    }
}
