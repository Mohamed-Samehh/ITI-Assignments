<?php
$envPath = __DIR__ . '/../.env';
$env = file_exists($envPath) ? parse_ini_file($envPath, false, INI_SCANNER_RAW) : [];

$dbHost = $env['DB_HOST'] ?? 'localhost';
$dbUser = $env['DB_USER'] ?? 'root';
$dbPass = $env['DB_PASS'] ?? '';
$dbName = $env['DB_NAME'] ?? 'lab4';

$conn = mysqli_connect($dbHost, $dbUser, $dbPass);
if (!$conn) {
    die('Database connection failed: ' . mysqli_connect_error());
}

mysqli_set_charset($conn, 'utf8mb4');

if (!mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS `$dbName`")) {
    die('Could not create database: ' . mysqli_error($conn));
}

if (!mysqli_select_db($conn, $dbName)) {
    die('Could not select database: ' . mysqli_error($conn));
}

$createTableSql = "CREATE TABLE IF NOT EXISTS users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    firstname VARCHAR(100) NOT NULL,
    lastname VARCHAR(100) NOT NULL,
    email VARCHAR(150) NOT NULL,
    address TEXT,
    country VARCHAR(100) NOT NULL,
    gender VARCHAR(20) NOT NULL,
    skills TEXT,
    username VARCHAR(100) NOT NULL UNIQUE,
    password VARCHAR(255) NOT NULL,
    department VARCHAR(100),
    room VARCHAR(100) NOT NULL,
    profile_pic VARCHAR(255),
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
)";

if (!mysqli_query($conn, $createTableSql)) {
    die('Could not create table: ' . mysqli_error($conn));
}

try {
    mysqli_query($conn, "DELETE u1 FROM users u1
        INNER JOIN users u2
        ON u1.username = u2.username AND u1.id < u2.id");
} catch (mysqli_sql_exception $e) {
    // Ignore — table might be empty or already clean
}

try {
    mysqli_query($conn, "ALTER TABLE users ADD UNIQUE (username)");
} catch (mysqli_sql_exception $e) {
    // Ignore — UNIQUE constraint already exists
}
