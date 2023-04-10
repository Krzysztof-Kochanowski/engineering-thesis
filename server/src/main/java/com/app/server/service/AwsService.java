package com.app.server.service;

import com.amazonaws.auth.AWSStaticCredentialsProvider;
import com.amazonaws.auth.BasicAWSCredentials;
import com.amazonaws.regions.Regions;
import com.amazonaws.services.s3.AmazonS3;
import com.amazonaws.services.s3.AmazonS3ClientBuilder;
import com.amazonaws.services.s3.model.*;
import org.apache.commons.io.IOUtils;
import org.springframework.core.env.Environment;
import org.springframework.stereotype.Service;

import java.io.IOException;
import java.io.InputStream;
import java.util.List;
import java.util.stream.Collectors;

@Service
public class AwsService {
    private final Environment env;
    private String bucketName;
    private String accessKeyId;
    private String secretAccessKey;
    private AmazonS3 s3Client;

    public AwsService(Environment env) {
        this.env = env;
        bucketName = env.getProperty("aws.bucket_name");
        accessKeyId = env.getProperty("aws.access_key_id");
        secretAccessKey = env.getProperty("aws.secret_access_key");
        BasicAWSCredentials credentials = new BasicAWSCredentials(accessKeyId, secretAccessKey);
        s3Client = AmazonS3ClientBuilder
                .standard()
                .withCredentials(new AWSStaticCredentialsProvider(credentials))
                .withRegion(Regions.EU_WEST_2)
                .build();
    }

    public void putObject(String key, InputStream input, ObjectMetadata metaData) {
        s3Client.putObject(new PutObjectRequest(bucketName, key, input, metaData));
    }

    public List<String> getObjectSummaries() {
        ListObjectsV2Request req = new ListObjectsV2Request().withBucketName(bucketName);
        ListObjectsV2Result listing = s3Client.listObjectsV2(req);
        return listing.getObjectSummaries().stream().map((S3ObjectSummary::getKey)).collect(Collectors.toList());
    }

    public byte[] getObject(String key) throws IOException {
        S3Object object = s3Client.getObject(new GetObjectRequest(bucketName, key));
        InputStream objectData = object.getObjectContent();
        byte[] bytes = IOUtils.toByteArray(objectData);
        objectData.close();
        return bytes;
    }
}
