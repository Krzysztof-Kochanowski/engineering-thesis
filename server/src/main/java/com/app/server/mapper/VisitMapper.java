package com.app.server.mapper;

import com.app.server.dto.display.VisitDisplayDto;
import com.app.server.entity.Visit;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR, uses = {VisitDetailsMapper.class, EmployeeMapper.class})
public interface VisitMapper {
    VisitDisplayDto asDisplayDto(Visit visit);
    List<VisitDisplayDto> asDisplayDtoList(List<Visit> entityList);
}
