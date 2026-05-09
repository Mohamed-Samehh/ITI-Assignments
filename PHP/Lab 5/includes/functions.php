<?php
// Escape text before printing it into HTML
function e($value)
{
    return htmlspecialchars((string) $value, ENT_QUOTES, 'UTF-8');
}

// Fetch a single user by id, or null if not found
function getUserById($conn, $id)
{
    $id = (int) $id;
    $stmt = mysqli_prepare($conn, 'SELECT * FROM users WHERE id = ?');
    mysqli_stmt_bind_param($stmt, 'i', $id);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);

    if ($user) {
        return $user;
    }
    return null;
}

// Fetch all users, newest first
function getAllUsers($conn)
{
    $users = [];
    $result = mysqli_query($conn, 'SELECT * FROM users ORDER BY id DESC');
    if ($result) {
        while ($row = mysqli_fetch_assoc($result)) {
            $users[] = $row;
        }
    }
    return $users;
}

// Save an uploaded image to /uploads.
// Returns the saved path, '' if no upload, or false if the file isn't an image.
function saveUploadedImage($fileInfo)
{
    if (!isset($fileInfo) || $fileInfo['error'] !== UPLOAD_ERR_OK) {
        return '';
    }

    // Reject anything that isn't an image
    $fileType = mime_content_type($fileInfo['tmp_name']);
    if (strpos($fileType, 'image') === false) {
        return false;
    }

    $uploadDir = __DIR__ . '/../uploads';
    if (!is_dir($uploadDir)) {
        mkdir($uploadDir, 0777, true);
    }

    // Sanitize the filename and prefix with a timestamp to keep it unique
    $safeName = preg_replace('/[^A-Za-z0-9._-]/', '_', basename($fileInfo['name']));
    $fileName = time() . '_' . $safeName;
    $targetPath = $uploadDir . '/' . $fileName;

    if (move_uploaded_file($fileInfo['tmp_name'], $targetPath)) {
        return 'uploads/' . $fileName;
    }

    return false;
}
