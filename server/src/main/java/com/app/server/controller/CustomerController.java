package com.app.server.controller;

import com.app.server.dto.display.CustomerDisplayDto;
import com.app.server.service.CustomerService;
import lombok.RequiredArgsConstructor;
import org.springframework.http.ResponseEntity;
import org.springframework.web.bind.annotation.GetMapping;
import org.springframework.web.bind.annotation.RequestMapping;
import org.springframework.web.bind.annotation.RestController;

import java.util.List;

@RestController
@RequiredArgsConstructor
@RequestMapping("/customer")
public class CustomerController {
    private final CustomerService customerService;

    @GetMapping()
    ResponseEntity<List<CustomerDisplayDto>> getCustomers () {
        return ResponseEntity.ok(customerService.getDisplayDto(customerService.findAll()));
    }
}
