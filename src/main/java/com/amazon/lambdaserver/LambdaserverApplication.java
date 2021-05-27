package com.amazon.lambdaserver;

import com.amazon.controller.RestController;
import org.springframework.boot.SpringApplication;
import org.springframework.boot.autoconfigure.SpringBootApplication;

@SpringBootApplication
public class LambdaserverApplication {

    public static void main(String[] args) {
        SpringApplication.run(RestController.class, args);
    }

}
