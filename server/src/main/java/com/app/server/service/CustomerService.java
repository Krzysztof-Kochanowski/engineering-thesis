package com.app.server.service;

import com.app.server.dto.display.CustomerDisplayDto;
import com.app.server.entity.Customer;
import com.app.server.mapper.CustomerMapper;
import com.app.server.repository.CustomerRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class CustomerService {
    private final CustomerMapper mapper;
    private final CustomerRepository repository;

    public List<Customer> findAll() {
        return repository.findAll();
    }

    public List<CustomerDisplayDto> getDisplayDto(List<Customer> customers) {
        return this.mapper.asDisplayDtoList(customers);
    }
}
