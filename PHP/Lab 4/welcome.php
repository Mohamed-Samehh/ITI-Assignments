<?php
session_start();
require_once 'includes/functions.php';

if (empty($_SESSION['user'])) {
    header('Location: login.php');
    exit;
}
?>
<!DOCTYPE html>
<html>
<head>
    <title>Cafeteria - Welcome</title>
</head>
<body>
    <?php if (!empty($_SESSION['profile_pic'])): ?>
        <img src="<?php echo e($_SESSION['profile_pic']); ?>" alt="Profile Picture" width="100"><br><br>
    <?php endif; ?>

    <h2>Welcome, <?php echo e($_SESSION['user']); ?>!</h2>
    <p>You have successfully logged in.</p>
    <p><a href="logout.php">Logout</a></p>
</body>
</html>
