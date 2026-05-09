<?php
require_once __DIR__ . '/autoload.php';

use App\Helpers\Auth;

// Block access if not logged in.
if (!Auth::check()) {
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
    <?php if (Auth::profilePic()): ?>
        <img src="<?php echo e(Auth::profilePic()); ?>" alt="Profile Picture" width="100"><br><br>
    <?php endif; ?>

    <h2>Welcome, <?php echo e(Auth::user()); ?>!</h2>
    <p>You have successfully logged in.</p>
    <p><a href="logout.php">Logout</a></p>
</body>
</html>
