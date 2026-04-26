package JobExchange.service;

import JobExchange.exception.BadRequestException;
import lombok.extern.slf4j.Slf4j;
import org.springframework.beans.factory.annotation.Value;
import org.springframework.core.io.Resource;
import org.springframework.core.io.UrlResource;
import org.springframework.stereotype.Service;
import org.springframework.web.multipart.MultipartFile;

import java.io.IOException;
import java.nio.file.Files;
import java.nio.file.Path;
import java.nio.file.Paths;
import java.nio.file.StandardCopyOption;
import java.util.List;
import java.util.UUID;

@Slf4j
@Service
public class FileStorageService {

    @Value("${file.upload-dir}")
    private String uploadDir;

    private static final List<String> ALLOWED_RESUME_MIME_TYPES = List.of(
            "application/pdf",
            "application/msword",
            "application/vnd.openxmlformats-officedocument.wordprocessingml.document",
            "text/plain"
    );

    public String storeResume(MultipartFile file, Long applicantId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !ALLOWED_RESUME_MIME_TYPES.contains(contentType)) {
            throw new BadRequestException("Invalid file type. Allowed: PDF, DOC, DOCX, TXT");
        }

        long maxSize = 5 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File too large. Max size: 5MB");
        }

        String originalFilename = file.getOriginalFilename();
        String extension = getFileExtension(originalFilename);

        String fileName = "resume_" + applicantId + "_" + UUID.randomUUID() + extension;

        try {
            Path uploadPath = Paths.get(uploadDir, "resumes", String.valueOf(applicantId));
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = "/uploads/resumes/" + applicantId + "/" + fileName;
            log.info("Resume saved: {}", relativePath);

            return relativePath;

        } catch (IOException e) {
            log.error("Failed to save resume: {}", originalFilename, e);
            throw new RuntimeException("Failed to save file", e);
        }
    }

    public Resource getResumeFile(String resumeUrl) {
        if (resumeUrl == null || resumeUrl.isEmpty()) {
            return null;
        }

        try {
            String relativePath = resumeUrl;
            if (relativePath.startsWith("/uploads/")) {
                relativePath = relativePath.substring(9);
            }

            Path filePath = Paths.get(uploadDir, relativePath);
            log.debug("Looking for file: {}", filePath);

            if (!Files.exists(filePath)) {
                log.warn("Resume file not found: {}", filePath);
                return null;
            }

            Resource resource = new UrlResource(filePath.toUri());
            if (resource.exists() && resource.isReadable()) {
                return resource;
            } else {
                log.warn("Resume file not readable: {}", filePath);
                return null;
            }
        } catch (Exception e) {
            log.error("Failed to get resume file: {}", resumeUrl, e);
            return null;
        }
    }

    public void deleteResume(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return;
        }

        try {
            String relativePath = fileUrl;
            if (relativePath.startsWith("/uploads/")) {
                relativePath = relativePath.substring(9);
            }

            Path filePath = Paths.get(uploadDir, relativePath);

            if (Files.exists(filePath)) {
                Files.delete(filePath);
                log.info("Resume deleted: {}", fileUrl);
            }
        } catch (IOException e) {
            log.error("Failed to delete resume: {}", fileUrl, e);
        }
    }

    public String storeAvatar(MultipartFile file, Long userId) {
        if (file == null || file.isEmpty()) {
            throw new BadRequestException("File is empty");
        }

        String contentType = file.getContentType();
        if (contentType == null || !contentType.startsWith("image/")) {
            throw new BadRequestException("Invalid file type. Allowed: images only (JPEG, PNG, etc.)");
        }

        long maxSize = 2 * 1024 * 1024;
        if (file.getSize() > maxSize) {
            throw new BadRequestException("File too large. Max size: 2MB");
        }

        String extension = getFileExtension(file.getOriginalFilename());
        String fileName = "avatar_" + userId + "_" + UUID.randomUUID() + extension;

        try {
            Path uploadPath = Paths.get(uploadDir, "avatars", String.valueOf(userId));
            if (!Files.exists(uploadPath)) {
                Files.createDirectories(uploadPath);
            }

            Path filePath = uploadPath.resolve(fileName);
            Files.copy(file.getInputStream(), filePath, StandardCopyOption.REPLACE_EXISTING);

            String relativePath = "/uploads/avatars/" + userId + "/" + fileName;
            log.info("Avatar saved: {}", relativePath);

            return relativePath;

        } catch (IOException e) {
            log.error("Failed to save avatar: {}", file.getOriginalFilename(), e);
            throw new RuntimeException("Failed to save file", e);
        }
    }

    public String getContentType(String fileUrl) {
        if (fileUrl == null || fileUrl.isEmpty()) {
            return "application/octet-stream";
        }

        String extension = getFileExtension(fileUrl);
        return switch (extension.toLowerCase()) {
            case ".pdf" -> "application/pdf";
            case ".doc" -> "application/msword";
            case ".docx" -> "application/vnd.openxmlformats-officedocument.wordprocessingml.document";
            case ".txt" -> "text/plain";
            case ".jpg", ".jpeg" -> "image/jpeg";
            case ".png" -> "image/png";
            default -> "application/octet-stream";
        };
    }

    private String getFileExtension(String filename) {
        if (filename == null || !filename.contains(".")) {
            return "";
        }
        return filename.substring(filename.lastIndexOf("."));
    }
}