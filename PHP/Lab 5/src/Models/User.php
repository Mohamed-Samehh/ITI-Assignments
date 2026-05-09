<?php
namespace App\Models;

use App\Database\Connection;

// Data access for the users table.
class User
{
    // Returns the user row, or null.
    public static function findById($id)
    {
        $conn = Connection::get();
        $id = (int) $id;
        $stmt = mysqli_prepare($conn, 'SELECT * FROM users WHERE id = ?');
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        return $user ?: null;
    }

    // Returns the user row, or null.
    public static function findByUsername($username)
    {
        $conn = Connection::get();
        $stmt = mysqli_prepare($conn, 'SELECT * FROM users WHERE username = ? LIMIT 1');
        mysqli_stmt_bind_param($stmt, 's', $username);
        mysqli_stmt_execute($stmt);
        $result = mysqli_stmt_get_result($stmt);
        $user = mysqli_fetch_assoc($result);
        mysqli_stmt_close($stmt);

        return $user ?: null;
    }

    // All users, newest first.
    public static function all()
    {
        $conn = Connection::get();
        $users = [];
        $result = mysqli_query($conn, 'SELECT * FROM users ORDER BY id DESC');
        if ($result) {
            while ($row = mysqli_fetch_assoc($result)) {
                $users[] = $row;
            }
        }
        return $users;
    }

    // Pass $excludeId when editing, so the user's own row is ignored.
    public static function usernameExists($username, $excludeId = 0)
    {
        $conn = Connection::get();
        $excludeId = (int) $excludeId;

        if ($excludeId > 0) {
            $stmt = mysqli_prepare($conn, 'SELECT id FROM users WHERE username = ? AND id != ? LIMIT 1');
            mysqli_stmt_bind_param($stmt, 'si', $username, $excludeId);
        } else {
            $stmt = mysqli_prepare($conn, 'SELECT id FROM users WHERE username = ? LIMIT 1');
            mysqli_stmt_bind_param($stmt, 's', $username);
        }
        mysqli_stmt_execute($stmt);
        mysqli_stmt_store_result($stmt);
        $exists = mysqli_stmt_num_rows($stmt) > 0;
        mysqli_stmt_close($stmt);

        return $exists;
    }

    // Insert a new user row.
    public static function create(array $data)
    {
        $conn = Connection::get();
        $stmt = mysqli_prepare(
            $conn,
            'INSERT INTO users (firstname, lastname, email, address, country, gender, skills, username, password, department, room, profile_pic)
             VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)'
        );
        mysqli_stmt_bind_param(
            $stmt,
            'ssssssssssss',
            $data['firstname'], $data['lastname'], $data['email'], $data['address'],
            $data['country'], $data['gender'], $data['skills'], $data['username'],
            $data['password'], $data['department'], $data['room'], $data['profile_pic']
        );
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    // Update an existing user row by id.
    public static function update($id, array $data)
    {
        $conn = Connection::get();
        $id = (int) $id;
        $stmt = mysqli_prepare(
            $conn,
            'UPDATE users SET firstname=?, lastname=?, email=?, address=?, country=?, gender=?, skills=?, username=?, password=?, department=?, room=?, profile_pic=?
             WHERE id=?'
        );
        mysqli_stmt_bind_param(
            $stmt,
            'ssssssssssssi',
            $data['firstname'], $data['lastname'], $data['email'], $data['address'],
            $data['country'], $data['gender'], $data['skills'], $data['username'],
            $data['password'], $data['department'], $data['room'], $data['profile_pic'],
            $id
        );
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }

    // Delete a user row by id.
    public static function delete($id)
    {
        $conn = Connection::get();
        $id = (int) $id;
        $stmt = mysqli_prepare($conn, 'DELETE FROM users WHERE id = ?');
        mysqli_stmt_bind_param($stmt, 'i', $id);
        mysqli_stmt_execute($stmt);
        mysqli_stmt_close($stmt);
    }
}
