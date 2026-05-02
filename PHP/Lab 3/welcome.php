<?php
session_start();

if (empty($_SESSION["user"])) {
    header("Location: login.php");
    exit;
}
?>

<!DOCTYPE html>
<html>
<head>
    <title>Cafeteria - Welcome</title>
</head>
<body>
    <h2>Welcome, <?php echo $_SESSION["user"]; ?>!</h2>
    
    <p>You have successfully logged in.</p>
    
    <p><a href="logout.php">Logout</a></p>
</body>
</html>
