package com.project.stationery_be_server.service.impl;

import com.cloudinary.Cloudinary;
import com.cloudinary.utils.ObjectUtils;
import com.project.stationery_be_server.service.UploadImageFile;
import lombok.AccessLevel;
import lombok.RequiredArgsConstructor;
import lombok.experimental.FieldDefaults;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.util.Map;

@Service
@RequiredArgsConstructor
@FieldDefaults(level = AccessLevel.PRIVATE, makeFinal = true)
public class UploadImageFileImpl implements UploadImageFile {
    Cloudinary cloudinary;

    @Override
    public Map uploadImageFile(MultipartFile file) throws IOException {
//        assert file.getOriginalFilename() != null;
//        String publicValue = file.getOriginalFilename();
        Map uploadResult = cloudinary.uploader().upload(file.getBytes(), ObjectUtils.emptyMap());
            return uploadResult;
    }
}

