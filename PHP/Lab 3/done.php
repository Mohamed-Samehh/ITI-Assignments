<!DOCTYPE html>
<html>
<head>
    <title>Review</title>
</head>
<body>
    <h2>Review</h2>

    <?php
    $firstname  = $_POST["firstname"] ?? "";
    $lastname   = $_POST["lastname"] ?? "";
    $email      = $_POST["email"] ?? "";
    $address    = $_POST["address"] ?? "";
    $gender     = $_POST["gender"] ?? "";
    $department = $_POST["department"] ?? "";
    $room       = $_POST["room"] ?? "";
    $skills     = $_POST["skills"] ?? [];

    $errors = [];
    
    if (trim($firstname) == "") {
        $errors[] = "First name is required.";
    }
    if (trim($lastname) == "") {
        $errors[] = "Last name is required.";
    }
    if (trim($email) == "") {
        $errors[] = "Email is required.";
    } else if (!filter_var($email, FILTER_VALIDATE_EMAIL)) {
        $errors[] = "Email is not valid.";
    }
    if ($gender != "Male" && $gender != "Female") {
        $errors[] = "Please select gender.";
    }
    if (trim($room) == "") {
        $errors[] = "Please select a room.";
    }

    if (!empty($errors)) {
        echo "<p style='color:red;'>Please fix these errors:</p>";
        echo "<ul>";
        foreach ($errors as $err) {
            echo "<li>" . $err . "</li>";
        }
        echo "</ul>";
        echo "<p><a href='registration.php'>Go back to form</a></p>";
        exit;
    }

    $profile_pic_name = "";
    if (isset($_FILES["profile_pic"]) && $_FILES["profile_pic"]["size"] > 0) {
        $file_type = mime_content_type($_FILES["profile_pic"]["tmp_name"]);
        if (strpos($file_type, "image") === false) {
            echo "<p style='color:red;'>Error: Please upload an image file.</p>";
            echo "<p><a href='registration.php'>Go back to form</a></p>";
            exit;
        }
        $profile_pic_name = time() . "_" . basename($_FILES["profile_pic"]["name"]);
        move_uploaded_file($_FILES["profile_pic"]["tmp_name"], $profile_pic_name);
    }

    $title = ($gender == "Male") ? "Mr." : "Miss";

    $filename = "users.txt";
    $file = fopen($filename, "a");
    
    if ($file) {
        $skillsString = implode(", ", $skills);
        $data = [$firstname, $lastname, $email, $gender, $address, $skillsString, $department, $room, $profile_pic_name];
        fputcsv($file, $data);
        fclose($file);
    } else {
        echo "<p style='color:red;'>Error: Could not save data.</p>";
    }

    $records = [];
    if (file_exists("users.txt")) {
        $file = fopen("users.txt", "r");
        while (($row = fgetcsv($file)) !== false) {
            $records[] = $row;
        }
        fclose($file);
    }
    ?>

    <p>Thanks <?php echo "$title $firstname $lastname"; ?>!</p>

    <h3>Your Submitted Info:</h3>
    <p>Name: <?php echo "$firstname $lastname"; ?></p>
    <p>Email: <?php echo $email; ?></p>
    <p>Address: <?php echo $address; ?></p>
    <p>Skills: <?php echo $skillsString; ?></p>
    <p>Department: <?php echo $department; ?></p>
    <p>Room: <?php echo $room; ?></p>
    <p>Profile Picture: <?php if (!empty($profile_pic_name)) echo "<a href='$profile_pic_name' target='_blank'>View Image</a>"; else echo "Not uploaded"; ?></p>

    <hr>

    <h3>All Customers (from users.txt)</h3>
    <table border="1" cellpadding="5">
        <tr>
            <th>First Name</th>
            <th>Last Name</th>
            <th>Email</th>
            <th>Gender</th>
            <th>Address</th>
            <th>Skills</th>
            <th>Department</th>
            <th>Room</th>
            <th>Profile Picture</th>
        </tr>
        <?php foreach ($records as $row): ?>
        <tr>
            <td><?php echo $row[0] ?? ""; ?></td>
            <td><?php echo $row[1] ?? ""; ?></td>
            <td><?php echo $row[2] ?? ""; ?></td>
            <td><?php echo $row[3] ?? ""; ?></td>
            <td><?php echo $row[4] ?? ""; ?></td>
            <td><?php echo $row[5] ?? ""; ?></td>
            <td><?php echo $row[6] ?? ""; ?></td>
            <td><?php echo $row[7] ?? ""; ?></td>
            <td><?php if (!empty($row[8])) echo "<a href='" . $row[8] . "' target='_blank'>View</a>"; ?></td>
        </tr>
        <?php endforeach; ?>
    </table>

    <p><a href="registration.php">Register another user</a></p>

</body>
</html>