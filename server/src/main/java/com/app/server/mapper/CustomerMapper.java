package com.app.server.mapper;

import com.app.server.dto.display.CustomerDisplayDto;
import com.app.server.entity.Customer;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface CustomerMapper {
    Customer asEntity(CustomerDisplayDto dto);
    List<CustomerDisplayDto> asDisplayDtoList(List<Customer> entityList);
}
