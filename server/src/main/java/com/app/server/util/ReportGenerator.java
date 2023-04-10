package com.app.server.util;

import com.amazonaws.services.s3.model.ObjectMetadata;
import com.app.server.entity.related.Record;
import com.app.server.entity.related.ReportOption;
import com.app.server.entity.related.VisitDetailsStatus;
import com.app.server.service.AwsService;
import org.apache.poi.ss.usermodel.Cell;
import org.apache.poi.ss.usermodel.CellStyle;
import org.apache.poi.ss.usermodel.Row;
import org.apache.poi.xssf.usermodel.XSSFFont;
import org.apache.poi.xssf.usermodel.XSSFSheet;
import org.apache.poi.xssf.usermodel.XSSFWorkbook;

import java.io.ByteArrayInputStream;
import java.io.ByteArrayOutputStream;
import java.io.IOException;
import java.text.DateFormat;
import java.text.SimpleDateFormat;
import java.time.Instant;
import java.time.ZoneId;
import java.util.Date;
import java.util.LinkedHashSet;
import java.util.List;

public class ReportGenerator {
    private List <Record> recordList;
    private XSSFWorkbook workbook;
    private XSSFSheet sheet;
    LinkedHashSet<ReportOption> reportOptions;
    private String[] reportHeaders;
    private String fileName;

    public ReportGenerator(List<Record> recordList, String sheetName, LinkedHashSet<ReportOption> reportOptions, String[] reportHeaders) {
        this.recordList = recordList;
        this.reportOptions = reportOptions;
        this.reportHeaders = reportHeaders;
        workbook = new XSSFWorkbook();
        sheet = workbook.createSheet(sheetName);
    }

    private void writeHeader() {
        Row row = sheet.createRow(0);
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setBold(true);
        font.setFontHeight(16);
        style.setFont(font);
        int columnCount = 0;

        for (String value : reportHeaders) createCell(row, columnCount++, value, style);
    }

    private void createCell(Row row, int columnCount, Object valueOfCell, CellStyle style) {
        sheet.autoSizeColumn(columnCount);
        Cell cell = row.createCell(columnCount);
        if (valueOfCell instanceof Integer) {
            cell.setCellValue((Integer) valueOfCell);
        } else if (valueOfCell instanceof Long) {
            cell.setCellValue((Long) valueOfCell);
        } else if (valueOfCell instanceof String) {
            cell.setCellValue((String) valueOfCell);
        } else if (valueOfCell instanceof VisitDetailsStatus) {
            switch ((VisitDetailsStatus) valueOfCell) {
                case ABSENT -> cell.setCellValue("Nieobecny");
                case PRESENT -> cell.setCellValue("Obecny");
                case ABSENT_EMPLOYEE -> cell.setCellValue("Urlop");
                case CANCELLED -> cell.setCellValue("Wizyta odwołana");
                default -> cell.setCellValue(valueOfCell.toString());
            }

        } else if (valueOfCell instanceof Instant) {
            cell.setCellValue(((Instant) valueOfCell).atZone(ZoneId.of("Europe/Warsaw")).toString());
        } else {
            cell.setCellValue("");
        }
        cell.setCellStyle(style);
    }

    private void write() {
        int rowCount = 1;
        CellStyle style = workbook.createCellStyle();
        XSSFFont font = workbook.createFont();
        font.setFontHeight(14);
        style.setFont(font);
        for (Record record : recordList) {
            Row row = sheet.createRow(rowCount++);
            int columnCount = 0;
            for (ReportOption reportOption : reportOptions) {
                switch (reportOption) {
                    case EMPLOYEE -> createCell(row, columnCount++, record.getEmployee(), style);
                    case ORGANIZATION -> createCell(row, columnCount++, record.getOrganization(), style);
                    case VISIT_STATUS -> createCell(row, columnCount++, record.getStatus(), style);
                    case COUNT -> createCell(row, columnCount++, record.getCount(), style);
                }
            }
        }
    }

    public byte[] generateExcelFile(AwsService awsService) throws IOException {
        writeHeader();
        write();

        ByteArrayOutputStream byteArrayOutputStream = new ByteArrayOutputStream();
        workbook.write(byteArrayOutputStream);
        byteArrayOutputStream.close();
        byte[] bytes = byteArrayOutputStream.toByteArray();

        saveToBucket(awsService, bytes);
        workbook.close();

        return bytes;
    }

    public void saveToBucket(AwsService awsService, byte[] bytes) {
        ByteArrayInputStream bi = new ByteArrayInputStream(bytes);
        long contentLength = bytes.length;

        DateFormat dateFormatter = new SimpleDateFormat("yyyy-MM-dd_HH:mm:ss");
        String currentDateTime = dateFormatter.format(new Date());

        fileName = "Raport_" + currentDateTime + ".xlsx";

        ObjectMetadata objectMetaData = new ObjectMetadata();
        objectMetaData.setContentType("application/vnd.openxmlformats-officedocument.spreadsheetml.sheet");
        objectMetaData.setContentLength(contentLength);
        objectMetaData.setContentDisposition(fileName);

        awsService.putObject(fileName, bi, objectMetaData);
    }

    public String getFileName() {
        return fileName;
    }

    public void setFileName(String fileName) {
        this.fileName = fileName;
    }
}
