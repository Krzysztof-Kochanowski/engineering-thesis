package com.app.server.mapper;

import com.app.server.dto.display.CustomerDisplayDto;
import com.app.server.dto.display.EmployeeDisplayDto;
import com.app.server.dto.display.PlannedVisitDisplayDto;
import com.app.server.entity.Customer;
import com.app.server.entity.Employee;
import com.app.server.entity.PlannedVisit;
import org.mapstruct.*;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface PlannedVisitMapper {
    @Named(value = "listMapping")
    PlannedVisitDisplayDto asDisplayDto(PlannedVisit plannedVisit);

    @IterableMapping(qualifiedByName = "listMapping")
    List<PlannedVisitDisplayDto> asDisplayDtoList(List<PlannedVisit> plannedVisitList);

    // These methods are necessary for mapping other class instances
    CustomerDisplayDto customerToCustomerDto(Customer customer);
    EmployeeDisplayDto employeeToEmployeeDto(Employee employee);
}
