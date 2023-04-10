package com.app.server.service;

import com.app.server.dto.display.EmployeeDisplayDto;
import com.app.server.entity.Employee;
import com.app.server.mapper.EmployeeMapper;
import com.app.server.repository.EmployeeRepository;
import lombok.RequiredArgsConstructor;
import org.springframework.stereotype.Service;

import java.util.List;

@Service
@RequiredArgsConstructor
public class EmployeeService {
    private final EmployeeMapper mapper;
    private final EmployeeRepository repository;

    public Employee findById(int id) {
        return this.repository.findById(id).orElse(null);
    }
    
    public List<Employee> findAll() {
        return this.repository.findAll();
    }

    public EmployeeDisplayDto getDisplayDto(Employee employee) {
        return mapper.asDisplayDto(employee);
    }
    
    public List<EmployeeDisplayDto> getDisplayDto(List<Employee> employees) {
        return this.mapper.asDisplayDtoList(employees);
    }
}
