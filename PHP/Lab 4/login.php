<?php
session_start();
require_once 'includes/db.php';
require_once 'includes/functions.php';

$error = '';

if ($_SERVER['REQUEST_METHOD'] === 'POST') {
    $username = trim($_POST['username'] ?? '');
    $password = $_POST['password'] ?? '';

    // Look up the user by username
    $stmt = mysqli_prepare($conn, 'SELECT firstname, lastname, password, profile_pic FROM users WHERE username = ? LIMIT 1');
    mysqli_stmt_bind_param($stmt, 's', $username);
    mysqli_stmt_execute($stmt);
    $result = mysqli_stmt_get_result($stmt);
    $user = mysqli_fetch_assoc($result);
    mysqli_stmt_close($stmt);

    // Verify the password against the stored hash
    if ($user && password_verify($password, $user['password'])) {
        $_SESSION['user'] = $user['firstname'] . ' ' . $user['lastname'];
        $_SESSION['profile_pic'] = $user['profile_pic'];
        header('Location: welcome.php');
        exit;
    } else {
        $error = 'Invalid username or password';
    }
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
