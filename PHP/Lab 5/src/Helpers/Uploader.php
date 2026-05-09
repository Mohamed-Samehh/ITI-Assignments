<?php
namespace App\Helpers;

use App\Traits\Sanitizes;

// Saves an uploaded image into /uploads.
class Uploader
{
    use Sanitizes;

    // Returns saved path on success, '' if no file was uploaded, false if not an image.
    public function save($fileInfo)
    {
        if (!isset($fileInfo) || $fileInfo['error'] !== UPLOAD_ERR_OK) {
            return '';
        }

        // Reject non-image uploads.
        $fileType = mime_content_type($fileInfo['tmp_name']);
        if (strpos($fileType, 'image') === false) {
            return false;
        }

        $uploadDir = __DIR__ . '/../../uploads';
        if (!is_dir($uploadDir)) {
            mkdir($uploadDir, 0777, true);
        }

        // Build a safe, unique filename.
        $original  = $this->clean(basename($fileInfo['name']));
        $safeName  = preg_replace('/[^A-Za-z0-9._-]/', '_', $original);
        $fileName  = time() . '_' . $safeName;
        $targetPath = $uploadDir . '/' . $fileName;

        if (move_uploaded_file($fileInfo['tmp_name'], $targetPath)) {
            return 'uploads/' . $fileName;
        }

        return false;
    }
}
