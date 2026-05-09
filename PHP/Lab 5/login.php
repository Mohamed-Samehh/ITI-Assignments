<?php
require_once __DIR__ . '/autoload.php';

use App\Helpers\Auth;

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    if (Auth::login($username, $password)) {
        header('Location: welcome.php');
        exit;
    }
    $error = 'Invalid username or password';
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cafeteria - Login</title>
</head>
<body>
    <h2>Cafeteria - Login</h2>

    <?php if ($error): ?>
        <p style="color:red;"><?php echo e($error); ?></p>
    <?php endif; ?>

    <form method="post">
        Username: <input type="text" name="username" required><br><br>
        Password: <input type="password" name="password" required><br><br>
        <input type="submit" value="Login">
    </form>

    <p><a href="registration.php">Don't have an account? Register here</a></p>
</body>
</html>
