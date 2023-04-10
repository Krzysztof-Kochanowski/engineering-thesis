package com.app.server.mapper;

import com.app.server.dto.display.SheetDisplayDto;
import com.app.server.entity.Sheet;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface SheetMapper {
    List<SheetDisplayDto> asDisplayDtoList(List<Sheet> sheet);
}
