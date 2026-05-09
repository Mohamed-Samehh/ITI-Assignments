<?php
namespace App\Helpers;

use App\Models\User;

// Session-based login helper.
class Auth
{
    // Starts the session if one isn't already active.
    public static function start()
    {
        if (session_status() === PHP_SESSION_NONE) {
            session_start();
        }
    }

    // Returns true on success, false on bad credentials.
    public static function login($username, $password)
    {
        self::start();
        $user = User::findByUsername($username);

        if ($user && password_verify($password, $user['password'])) {
            $_SESSION['user']        = $user['firstname'] . ' ' . $user['lastname'];
            $_SESSION['profile_pic'] = $user['profile_pic'];
            return true;
        }
        return false;
    }

    // True if a user is logged in.
    public static function check()
    {
        self::start();
        return !empty($_SESSION['user']);
    }

    public static function user()
    {
        self::start();
        return $_SESSION['user'] ?? null;
    }

    public static function profilePic()
    {
        self::start();
        return $_SESSION['profile_pic'] ?? null;
    }

    public static function logout()
    {
        self::start();
        $_SESSION = [];
        session_destroy();
    }
}
