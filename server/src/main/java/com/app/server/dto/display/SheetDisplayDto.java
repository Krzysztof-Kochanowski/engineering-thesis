package com.app.server.dto.display;

import lombok.Value;

import java.io.Serializable;
import java.util.Date;

@Value
public class SheetDisplayDto implements Serializable {
    int id;
    String fileName;
    Date startDate;
    Date endDate;
}
