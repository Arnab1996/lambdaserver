package com.amazon.controller;

import com.fasterxml.jackson.databind.ObjectMapper;
import org.springframework.boot.autoconfigure.EnableAutoConfiguration;
import org.springframework.context.annotation.Bean;
import org.springframework.http.HttpStatus;
import org.springframework.http.ResponseEntity;
import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.*;
import org.springframework.web.servlet.config.annotation.CorsRegistry;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurer;
import org.springframework.web.servlet.config.annotation.WebMvcConfigurerAdapter;

import java.io.File;
import java.io.IOException;
import java.util.List;


/**
 * @author saarnab
 */
@Controller
@EnableAutoConfiguration
public class RestController {

    public ObjectMapper objectMapper = new ObjectMapper();

    @Bean
    public WebMvcConfigurer corsConfigurer() {
        return new WebMvcConfigurerAdapter() {
            @Override
            public void addCorsMappings(CorsRegistry registry) {
                registry.addMapping("/**")
                        .allowedOrigins("*")
                        .allowedMethods("GET", "POST", "PUT", "DELETE", "HEAD", "OPTIONS")
                        .allowedHeaders("*", "Access-Control-Allow-Headers", "origin", "Content-type", "accept", "x-requested-with", "x-requested-by") //What is this for?
                        .allowCredentials(false);
            }
        };
    }

    @CrossOrigin
    @RequestMapping(value = "product", produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getProductListing(@RequestParam("productName") String productName) throws IOException {

        /*
        System.out.println("Enter getProductListing");
        System.out.println("getProductListing productName : " + productName);
        */

        switch (productName) {
            case "SituationalMessagesAMER":
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getProductListingSMAMER.json"), List.class));
            case "SituationalMessagesAPAC":
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getProductListingSMAPAC.json"), List.class));
            case "SituationalMessagesEMEA":
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getProductListingSMEMEA.json"), List.class));
            default:
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getProductListingVS.json"), List.class));
        }

    }

    @CrossOrigin
    @RequestMapping(value = "component", produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getComponentDetails(@RequestParam("productName") String productName, @RequestParam("componentName") String componentName) throws IOException {

        /*
        System.out.println("Enter getComponentDetails");
        System.out.println("getComponentDetails productName : " + productName);
        System.out.println("getComponentDetails componentName : " + componentName);
        */

        switch (productName) {
            case "SituationalMessagesAMER":
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getComponentSMAMER.json"), List.class));
            case "SituationalMessagesAPAC":
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getComponentSMAPAC.json"), List.class));
            case "SituationalMessagesEMEA":
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getComponentSMEMEA.json"), List.class));
            default:
                return ResponseEntity.status(HttpStatus.OK).
                        header("Content-Type", "application/json")
                        .body(objectMapper.readValue(new File("files/getComponentVF.json"), List.class));
        }
    }

    @CrossOrigin
    @RequestMapping(value = "component", produces = {"application/json"}, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<String> updateComponentDetails(@RequestParam("productName") String productName, @RequestParam("componentName") String componentName,
                                                         @RequestBody String fields) {

        System.out.println("Enter updateComponentDetails");
        System.out.println("updateComponentDetails productName : " + productName);
        System.out.println("updateComponentDetails componentName : " + componentName);
        System.out.println("Fields : " + fields);
        System.out.println("Exit updateComponentDetails\n");
        return ResponseEntity.status(HttpStatus.ACCEPTED).
                header("Content-Type", "application/json")
                .body(fields);
    }

    /**
     * Marking for IVR Mocks
     */

    @CrossOrigin
    @RequestMapping(produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getIVRProductListing() throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body(objectMapper.readValue(new File("files/getSMSType.json"), List.class));
    }

    @CrossOrigin
    @RequestMapping(value = "smsType", produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getIVRComponentDetails(@RequestParam("smsType") String smsType) throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body(objectMapper.readValue(new File("files/getSMSBody.json"), List.class));
    }

    @CrossOrigin
    @RequestMapping(value = "smsType", produces = {"application/json"}, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> updateIVRComponentDetails(@RequestParam("smsType") String smsType, @RequestBody String fields) throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body(objectMapper.readValue(new File("files/getSMSBodyUpdated.json"), List.class));
    }

    @CrossOrigin
    @RequestMapping(value = "smsTypeCH", produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getChangelog(@RequestParam("smsTypeCH") String smsTypeCH) throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body(objectMapper.readValue(new File("files/getChangelog.json"), List.class));
    }

    @CrossOrigin
    @RequestMapping(value = "sendSMS", produces = {"application/json"}, method = RequestMethod.POST)
    @ResponseBody
    public ResponseEntity<Object> sendSMS(@RequestParam("phone") String phone, @RequestBody String fields) throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body("");
    }

    //http://localhost:8080/getTable
    @CrossOrigin
    @RequestMapping(value = "getTable", produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getMTSSTable() throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body(objectMapper.readValue(new File("files/getMTSSTable.json"), List.class));
    }

    //http://localhost:8080/getList
    @CrossOrigin
    @RequestMapping(value = "getList", produces = {"application/json"}, method = RequestMethod.GET)
    public @ResponseBody
    ResponseEntity<Object> getMTSSList() throws IOException {
        return ResponseEntity.status(HttpStatus.OK).
                header("Content-Type", "application/json")
                .body(objectMapper.readValue(new File("files/getMTSSList.json"), List.class));
    }

}
