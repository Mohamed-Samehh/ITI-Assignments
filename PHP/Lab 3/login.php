<?php
session_start();

if ($_SERVER["REQUEST_METHOD"] == "POST") {
    $email = $_POST["username"] ?? "";
    $password = $_POST["password"] ?? "";
    $login_ok = false;

    if (file_exists("users.txt")) {
        $file = fopen("users.txt", "r");
        while (($row = fgetcsv($file)) !== false) {
            if ($row[2] == $email && $row[7] == $password) {
                $login_ok = true;
                $_SESSION["user"] = $row[0] . " " . $row[1];
                break;
            }
        }
        fclose($file);
    }

    if ($login_ok) {
        header("Location: welcome.php");
        exit;
    } else {
        echo "<p style='color:red;'>Invalid username or password</p>";
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
    
    <form method="post">
        Email: <input type="text" name="username" required><br><br>
        Password: <input type="password" name="password" required><br><br>
        <input type="submit" value="Login">
    </form>
    
    <p><a href="registration.php">Don't have an account? Register here</a></p>
</body>
</html>
