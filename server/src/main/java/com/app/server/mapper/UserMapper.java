package com.app.server.mapper;

import com.app.server.dto.display.UserDisplayDto;
import com.app.server.entity.User;
import org.mapstruct.InjectionStrategy;
import org.mapstruct.Mapper;
import org.mapstruct.ReportingPolicy;

import java.util.List;

@Mapper(unmappedTargetPolicy = ReportingPolicy.IGNORE, componentModel = "spring",
        injectionStrategy = InjectionStrategy.CONSTRUCTOR)
public interface UserMapper {
    UserDisplayDto asDisplayDto(User user);
    List<UserDisplayDto> asDisplayDtoList(List<User> entityList);
}
