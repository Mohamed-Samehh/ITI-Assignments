<?php
namespace App\Database;

// Singleton MySQL connection.
class Connection
{
    private static $conn = null;

    public static function get()
    {
        if (self::$conn !== null) {
            return self::$conn;
        }

        // DB settings from .env, with fallbacks.
        $envPath = __DIR__ . '/../../.env';
        if (file_exists($envPath)) {
            $env = parse_ini_file($envPath, false, INI_SCANNER_RAW);
        } else {
            $env = [];
        }

        $host = $env['DB_HOST'] ?? 'localhost';
        $user = $env['DB_USER'] ?? 'root';
        $pass = $env['DB_PASS'] ?? '';
        $name = $env['DB_NAME'] ?? 'lab4';

        $conn = mysqli_connect($host, $user, $pass);
        if (!$conn) {
            die('Database connection failed: ' . mysqli_connect_error());
        }
        mysqli_set_charset($conn, 'utf8mb4');

        if (!mysqli_query($conn, "CREATE DATABASE IF NOT EXISTS `$name`")) {
            die('Could not create database: ' . mysqli_error($conn));
        }
        if (!mysqli_select_db($conn, $name)) {
            die('Could not select database: ' . mysqli_error($conn));
        }

        self::createUsersTable($conn);

        self::$conn = $conn;
        return $conn;
    }

    private static function createUsersTable($conn)
    {
        $sql = "CREATE TABLE IF NOT EXISTS users (
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
        mysqli_query($conn, $sql);
    }
}
